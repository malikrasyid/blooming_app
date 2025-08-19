const crypto = require('crypto');

function verifyWebhook(req, res) {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token && mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
}

function isSignatureValid(req) {
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  if (!appSecret) return true; // Skip verification if not configured

  try {
    const signature = req.get('x-hub-signature-256') || '';
    if (!signature.startsWith('sha256=')) return false;
    const expected = crypto
      .createHmac('sha256', appSecret)
      .update(req.rawBody || Buffer.from(JSON.stringify(req.body)))
      .digest('hex');
    const received = signature.replace('sha256=', '');
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(received));
  } catch (e) {
    return false;
  }
}

function receiveWebhook(req, res) {
  if (!isSignatureValid(req)) {
    return res.sendStatus(401);
  }

  const body = req.body || {};

  if (body.object !== 'whatsapp_business_account') {
    return res.sendStatus(404);
  }

  try {
    (body.entry || []).forEach(entry => {
      (entry.changes || []).forEach(change => {
        const value = change.value || {};
        const messages = value.messages || [];
        messages.forEach(message => {
          const from = message.from;
          const type = message.type;
          const text = type === 'text' ? message.text?.body : undefined;
          console.log('[WhatsApp] Incoming message', { from, type, text });
        });
      });
    });
  } catch (err) {
    console.error('Error handling WhatsApp webhook:', err);
  }

  return res.status(200).send('EVENT_RECEIVED');
}

module.exports = { verifyWebhook, receiveWebhook };


