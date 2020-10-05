import crypto from 'crypto';

const secret = process.env.BHOOS_WEB_HOOK_SECRET || 'bhoos-webhook-secret';

/**
 * Check if the response received from github webhook
 * is actually from github and not a fake one
 */
export function validateSignature(signature: string, body: string) {
  const sha = crypto.createHmac('sha1', secret);
  sha.update(body);
  const digest = sha.digest('hex');
  return signature === `sha1=${digest}`;
}
