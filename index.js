const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal'); //(terminal)
//(web) const QRCode = require('qrcode');
//(web) const express = require('express');
require('dotenv').config();

//(web) const app = express();
//(web) const PORT = 3000;

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash" 
});


// Create a new client instance
const client = new Client();
let qrCodeUrl = ''; // Variable to store the QR code URL


// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Client is ready!');
});


// When the client received QR-Code
client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true}); //(terminal)
    //(web) // Convert the QR code to a data URL
    //(web) QRCode.toDataURL(qr, (err, url) => {
    //(web)     if (err) {
    //(web)         console.error('Failed to generate QR Code:', err);
    //(web)     } else {
    //(web)         qrCodeUrl = url; // Store the generated QR code URL
    //(web)         console.log('QR Code updated');
    //(web)     }
    //(web) });
});

client.on('message_create', async message => {
	if (message.body.toString().toLowerCase().startsWith('alya,')) { 
	
    // Generate response from AI model
        try {
            const result = await model.generateContent(message.body);
            const reply = result.response.text(); // Adjust based on API response structure
            console.log(`Generated response: ${reply}`);
            // client.sendMessage(message.from, result.response.text()); //send response to Whatsapp
            await client.sendMessage(message.from, reply);
        } catch (error) {
            console.error('Error generating AI response:', error);
        }
    
    
    }
});

/*
// Serve QR code on a simple web page
app.get('/', (req, res) => {
    if (qrCodeUrl) {
        res.send(`
            <html>
                <head>
                    <title>WhatsApp QR Code</title>
                </head>
                <body>
                    <h1>Scan QR Code to Connect to WhatsApp</h1>
                    <img src="${qrCodeUrl}" alt="QR Code" />
                </body>
            </html>
        `);
    } else {
        res.send(`
            <html>
                <head>
                    <title>WhatsApp QR Code</title>
                </head>
                <body>
                    <h1>QR Code is not available yet. Please refresh the page.</h1>
                </body>
            </html>
        `);
    }
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

*/

// Start your client
client.initialize();
