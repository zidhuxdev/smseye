// server.js - For Vercel Deployment
// This script receives a POST request with a "message" and forwards it to Telegram.
// Environment variables required on Vercel: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message } = req.body;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (!botToken || !chatId) {
    console.error('CRITICAL: Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json({ status: 'success', data });
    } else {
      console.error('Telegram API Error:', data);
      return res.status(response.status).json({ error: 'Telegram API Error', data });
    }
  } catch (error) {
    console.error('Fetch Error:', error.message);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
