const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Configuration
const TELEGRAM_BOT_TOKEN = "8337888917:AAHKOIzDa3dEsozjEtiWxwTyQeO6atOnsaw";
const TELEGRAM_CHAT_IDS = ["6485686197"];
const PORT = process.env.PORT || 3000;

app.post('/forward-sms', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).send('No message provided');
    }

    console.log(`Received message: ${message.substring(0, 50)}...`);

    const sendPromises = TELEGRAM_CHAT_IDS.map(chatId => {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        return axios.post(url, {
            chat_id: chatId,
            text: message
        }).catch(err => {
            console.error(`Error sending to ${chatId}: ${err.message}`);
        });
    });

    try {
        await Promise.all(sendPromises);
        res.status(200).send('OK');
    } catch (error) {
        res.status(500).send('Error forwarding to Telegram');
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
