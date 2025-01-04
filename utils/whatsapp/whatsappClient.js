const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const logger = require('../../logger');  // Import the logger


const { uploadSessionToS3 , retrieveSessionFromS3 } = require('./awsService'); // Import S3 service

let whatsappClient;
let isClientReady = false;
const userId = 'user1'; // Unique user ID for the session

const sessionDirectory = path.resolve(__dirname, '../../.wwebjs_auth'); // Directory for session files

// Function to initialize WhatsApp client
const initializeWhatsAppClient = async () => {
  try {
    // Ensure the session directory exists
    // if (!fs.existsSync(sessionDirectory)) {
    //   fs.mkdirSync(sessionDirectory, { recursive: true });
    // }

    // // Check if session exists locally
    // if (fs.existsSync(path.join(sessionDirectory, 'Default'))) {
    //   logger.info('Local session directory exists. Using it...');
    // } else {
    //   logger.info(`Local session directory not found. Checking S3...and trying place session at ${sessionDirectory}`);
    //   const sessionRetrieved = await retrieveSessionFromS3(sessionDirectory);

    //   logger.info("sesssion retrived",sessionRetrieved);

    //   if (!sessionRetrieved) {
    //     logger.info('No valid session found in S3. Creating a new session...');
    //   }
    // }

    // Initialize WhatsApp client
    whatsappClient = new Client({
      authStrategy: new LocalAuth({ dataPath: sessionDirectory }),
      puppeteer: {
        headless: true, // Ensure headless mode is enabled
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Add these flags to fix root user issue
      },
    });

    setupEventListeners(whatsappClient);
    await whatsappClient.initialize();
  } catch (error) {
    console.error('Error initializing WhatsApp client:', error);
  }
};


// Helper function to set up event listeners for the WhatsApp client
  const setupEventListeners = (client) => {
    client.on('qr', (qr) => {
      try {
        logger.info('QR Code received. Generating link...');
  
        // Generate the QR code URL using a public API
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qr)}&size=200x200`;
  
        logger.info('QR Code URL:', qrUrl); // This will print the QR code link to the console
      
      } catch (error) {
        console.error('Error generating QR code URL:', error);
      }
    });

  client.on('authenticated', async () => {
    logger.info('Client authenticated successfully!');
    logger.info('Waiting for session files to be ready...');
    await delay(50000); // Add a small delay to ensure files are ready
    logger.info('Uploading session directory to S3...');
    await uploadSessionToS3(sessionDirectory);
  });

  client.on('ready', () => {
    logger.info('WhatsApp client is ready!');
    isClientReady = true;
  });

  client.on('auth_failure', (msg) => {
    console.error('Authentication failed:', msg);
  });
};

// Function to check if the client is ready
const getWhatsAppClient = () => {
  if (!whatsappClient || !isClientReady) {
    throw new Error('WhatsApp client is not initialized or ready.');
  }
  return whatsappClient;
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


module.exports = {
  initializeWhatsAppClient,
  getWhatsAppClient,
};
