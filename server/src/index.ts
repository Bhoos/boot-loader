#!/usr/bin/env node
import { UDP_PORT, getOracle, App, Trigger } from '@bhoos/boot-loader-common';
import { setup } from '@bhoos/boot-loader-client';
import { UdpSocket, UdpStream } from '@bhoos/udp';
import { AppClient } from './AppClient';
import { validateSignature } from './validateSignature';
import { createServer } from 'http';

import express from 'express';

const { version } = require('../package.json');

const webappPort = process.env.PORT || 3000;
const secret = process.env.BHOOS_WEB_HOOK_SECRET;

// List of all client apps waiting for triggers
const apps: Array<AppClient> = [];
const socket = new UdpSocket<AppClient>(getOracle(), 1);

// Listen for stream requests
socket.listen(UDP_PORT);

socket.onConnect(App, async (app, stream) => {
  const appClient = new AppClient(app, (startReplacement) => {
    stream.send(new Trigger(startReplacement))
  });

  apps.push(appClient);
  return appClient;
});

socket.onClose((client) => {
  const idx = apps.indexOf(client);
  if (idx >= 0) {
    apps.splice(idx, 1);
  }
});

const webapp = express();
const server = webapp.listen(webappPort, () => {
  console.log(`WebApp running at port ${webappPort}`);
});

// Setup a self update
const selfUpdateClose = setup('boot-loader-server', version, 'bhoos', 'boot-loader', 2);

// setup raw handler to receive any post data
// as raw data, required for validating signature
webapp.use(express.raw({ type: '*/*' }));

// Listen for git-hooks
webapp.post('/git-hook/*', (req, res) => {
  const event = req.headers['x-github-event'] as string;
  if (!validateSignature(req.headers['x-hub-signature'] as string, req.body)) {
    res.status(502);
    res.send('Signature mismatch');
    return;
  }

  const body = JSON.parse(req.body);
  const triggered = apps.filter(k => k.trigger(event, body));

  // Reply with the triggered apps information
  res.header('Content-Type', 'text/plain');
  res.send(triggered.length ? `Triggered ${triggered.map(k => k.name).join('\n\t')}` : `No apps triggered`);
});

// Display status page
webapp.get('/status', (req, res) => {
  res.header('Content-Type', 'text/plain');
  let content = 'Listed apps:\n\t';
  content += apps.map((a, idx) => `${idx+1}. ${a.name}`).join('\n\t');
  res.send(content);
});

// Handle all stray requests
webapp.get('/*', (req, res) => {
  res.header('Content-Type', 'text/plain');
  res.end(`Boot-Loader-Server@${version}`);
});

function shutdown() {
  // Close the self update client
  selfUpdateClose();

  // Gracefully close the web server
  server.close(() => {
    // Close the UDP socket
    socket.close();
  });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
