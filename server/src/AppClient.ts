import { UdpStream } from '@bhoos/udp';
import { App, Trigger } from '@bhoos/boot-loader-common';

export class AppClient {
  private readonly app: App;
  private readonly stream: UdpStream;
  private readonly address: string;
  get name() {
    return `${this.app.app} | ${this.address} | ${this.app.type} | ${this.app.owner}/${this.app.repo} | ${this.app.version}`;
  }

  constructor(app: App, stream: UdpStream) {
    this.app = app;
    this.stream = stream;
    this.address = this.stream.remote.address;
  }

  trigger(event: string, body: any) {
    if (this.app.type === 'development') {
      if (event !== 'push' || body.ref !== 'refs/heads/master') return false;
    } else if (this.app.type === 'staging') {
      if (event !== 'release' || body.action !== 'created') return false;
    } else if (this.app.type === 'production') {
      if (event !== 'release' || body.action !== 'published') return false;
    } else {
      return false;
    }

    // TODO: Run replace update only if there is a slot available and this is not a load decrease event
    this.stream.send(new Trigger(true));
  }
}
