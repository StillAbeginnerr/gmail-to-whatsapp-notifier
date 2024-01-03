const express = require('express');
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const twilio = require('twilio');
const path = require('path');
const fs = require('fs');
require('dotenv').config();


const app = express();
const port = 3000;

let twilioClient = null; // Initialize Twilio client as null initially

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

const scopes = ['https://www.googleapis.com/auth/gmail.readonly'];
const authorizationUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
});

app.get('/auth', async (req, res) => {
  try {
    console.log('Redirecting to authorization URL:', authorizationUrl);
    res.redirect(authorizationUrl);
  } catch (error) {
    console.error('Error during /auth endpoint:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/dashboard', async (req, res) => {
  try {
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 3,
    });

    const messages = response.data.messages || [];

    const messageDetails = await Promise.all(
      messages.map(async (message) => {
        const messageResponse = await gmail.users.messages.get({
          userId: 'me',
          id: message.id,
        });

        const messageContent = messageResponse.data.snippet;
        const senderEmail = messageResponse.data.payload.headers.find(header => header.name === 'From').value;

        return {
          sender: senderEmail,
          messageContent,
        };
      })
    );

    const filePath = 'messageDetails.json';
    fs.writeFileSync(filePath, JSON.stringify(messageDetails, null, 2));

    res.status(200).json({ success: true, messageDetails });
  } catch (error) {
    console.error('Error during rendering:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/oauth2callback', async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error during OAuth callback:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.use((req, res, next) => {
  console.log('Middleware triggered');
  if (!twilioClient) {
    console.log('Initializing Twilio client');
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID || 'AC.', process.env.TWILIO_AUTH_TOKEN);
    console.log('Twilio client initialized successfully');
  } else {
    console.log('Twilio client already initialized');
  }
  next();
});


app.post('/send-whatsapp', async (req, res) => {
  try {
    
    if (!twilioClient) {
      // Twilio client is not initialized, return an error
      return res.status(500).json({ success: false, error: 'Twilio not initialized' });
    }
    console.log('Attempting to send WhatsApp message');
    const messageDetailsPath = path.join(__dirname, 'messageDetails.json');
    const messageDetails = JSON.parse(fs.readFileSync(messageDetailsPath, 'utf-8'));
    const { messageContent } = messageDetails[0]; // Assuming the first message

    // Example usage in sending a WhatsApp message
    const message = await require('twilio')(`${process.env.TWILIO_ACCOUNT_SID}`,`${process.env.TWILIO_AUTH_TOKEN}`).messages.create({
      from: 'whatsapp:+11234567890',  // Replace with your Twilio WhatsApp-enabled phone number
      to: 'whatsapp:+911234567890',   // Replace with the recipient's WhatsApp phone number
      body: `--> ${messageContent}`,
    });
    
    console.log(`WhatsApp message sent with SID: ${message.sid}`);
    console.log(`WhatsApp message sent with SID: ${message.sid}`);
    res.status(200).json({ success: true, messageSid: message.sid });
  } catch (error) {
    console.error(`Error sending WhatsApp message: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
