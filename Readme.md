# Project Documentation: Gmail-to-WhatsApp Notifier

## Overview
This project is a Node.js application that integrates with Gmail and Twilio to create a simple notifier. It allows users to authenticate with Gmail, retrieve the latest email messages, and send the content of the first message as a WhatsApp message using Twilio.

## Prerequisites
Before using this project, make sure you have the following:

1. **Node.js and npm:** Ensure that Node.js and npm (Node Package Manager) are installed on your machine. You can download them from [Node.js official website](https://nodejs.org/).

2. **Twilio Account:** You need a Twilio account with a registered WhatsApp-enabled phone number. Obtain the Account SID and Auth Token from the [Twilio Console](https://www.twilio.com/console).

3. **Google API Credentials:** Set up a project in the [Google Developers Console](https://console.developers.google.com/) and create OAuth 2.0 credentials. Note down the Client ID, Client Secret, and Redirect URI.

4. **Environment Variables:** Create a `.env` file in the project root and set the following variables:

    ```env
    CLIENT_ID=your_google_client_id
    CLIENT_SECRET=your_google_client_secret
    REDIRECT_URI=your_google_redirect_uri
    TWILIO_ACCOUNT_SID=your_twilio_account_sid
    TWILIO_AUTH_TOKEN=your_twilio_auth_token
    ```

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/gmail-to-whatsapp-notifier.git
    cd gmail-to-whatsapp-notifier
    cd Backend
    ```

2. Install dependencies:
    ```bash
    npm install
    npm i nodemon
    ```

## Usage
1. Start the application:
    ```bash
    npm start
    ```
   The application will be accessible at `http://localhost:3000`.

2. Navigate to `http://localhost:3000/auth` to initiate the Gmail authentication process.

3. Grant necessary permissions to the application.

4. After authentication, you will be redirected to the dashboard (`http://localhost:3000/dashboard`) where the latest email details will be displayed.

5. To send the content of the first email as a WhatsApp message, navigate to `http://localhost:3000/send-whatsapp`. Ensure Twilio is initialized via the middleware.

## Endpoints

### `/auth`
- **Method:** GET
- Initiates the Gmail authentication process. Redirects users to the Gmail authorization URL.

### `/dashboard`
- **Method:** GET
- Retrieves the latest email messages (up to 3) and displays sender and message content details in JSON format.

### `/oauth2callback`
- **Method:** GET
- Handles the callback from Gmail after successful user authentication. Sets OAuth2 credentials and redirects to the dashboard.

### `/send-whatsapp`
- **Method:** POST
- Sends the content of the first email message as a WhatsApp message using Twilio. Requires Twilio to be initialized.

## Middleware
The application includes middleware to initialize the Twilio client. The middleware ensures that the Twilio client is initialized before processing any requests.

## Important Notes
- Ensure proper setup of environment variables in the `.env` file.
- The application assumes the existence of a WhatsApp-enabled Twilio phone number for sending messages.
- Gmail authentication and token retrieval are handled through the Google OAuth 2.0 process.

## Troubleshooting
- If you encounter issues, check the console for error messages.
- Ensure all required dependencies and environment variables are properly configured.

## Credits
This project was created with ❤️ by Shivam Agarwal (www.shivamagarwal.co.in)

Feel free to contribute or report issues.

Some Initial Testing Examples :)
![image](https://github.com/StillAbeginnerr/gmail-to-whatsapp-notifier/assets/88205668/8de8fcd7-3877-4574-b628-37692ac1fdbe)
![image](https://github.com/StillAbeginnerr/gmail-to-whatsapp-notifier/assets/88205668/f66a73c9-e99f-4c22-ae20-f86142f8a3a3)


