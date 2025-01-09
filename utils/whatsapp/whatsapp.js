const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const { getWhatsAppClient } = require('./whatsappClient'); // Import getClient function
const logger = require('../../logger');  // Import the logger



// Declare the client variable first
let whatsappClient; // Global client instance
let isClientReady = false; // Track if the client is ready


// Initialize WhatsApp Client
const initializeWhatsAppClient = async () => {
  if (whatsappClient) {
    logger.info('WhatsApp client already initialized.');
    whatsappClient.on('ready', () => {
      logger.info('WhatsApp client is ready!');
      isClientReady = true;
    });
    return;
  }

  logger.info("Initializing WhatsApp client...");

  // Initialize whatsappClient here, after declaring the variable
  whatsappClient = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true },
  });

  whatsappClient.on('qr', (qr) => {
    logger.info('QR Code received:');
    qrcode.generate(qr, { small: true });
  });

  whatsappClient.on('ready', () => {
    logger.info('WhatsApp client is ready!');
    isClientReady = true;
  });

  whatsappClient.on('authenticated', () => {
    logger.info('Client authenticated successfully!');
  });

  whatsappClient.on('auth_failure', (msg) => {
    console.error('Authentication failed:', msg);
  });

  await whatsappClient.initialize();
};

// Function to check if the client is ready
// const getWhatsAppClient = () => {
//   if (!whatsappClient || !isClientReady) {
//     throw new Error('WhatsApp client is not initialized or ready.');
//   }
//   return whatsappClient;
// };

// Function to send a WhatsApp message with text and image
const sendEnhancedWhatsAppMessage = async (orderId, phone, name, plan, deliveryDate, orderType) => {
  const client = getWhatsAppClient(); // Use the initialized client
  const formattedPhone = phone.startsWith('91') ? `${phone}@c.us` : `91${phone}@c.us`;

  const whatsappMessage = 
  orderType === "sample"
    ? `Hello ${name},\n\nThank you for trying Daily Fruit Co.! 🎉\n\nYour sample order (${orderId}) is received and under review. Details:\n🌟 Plan: ${plan}\n📅 Delivery: ${deliveryDate}\n📦 Type: ${orderType}\n\nWe’ll notify you once it’s confirmed and ready. Get ready to enjoy a taste of freshness! 🥝🍎🍇\n\nWarm regards,\n🍎 The Daily Fruit Co. Team`
    : `Hello ${name},\n\nThank you for subscribing to Daily Fruit Co.! 🎉\n\nYour subscription order (${orderId}) is received and under review. Details:\n🌟 Plan: ${plan}\n📅 First Delivery: ${deliveryDate}\n📦 Type: ${orderType}\n\nWe’ll notify you once it’s confirmed and ready. Fresh fruits will soon be a regular at your doorstep! 🥝🍎🍇\n\nWarm regards,\n🍎 The Daily Fruit Co. Team`;

  try {
    const media = MessageMedia.fromFilePath('./oplaced.png'); // Path to your image
    await client.sendMessage(formattedPhone, media, { caption: whatsappMessage });
    logger.info('Image sent successfully');
  } catch (error) {
    console.error('Failed to send WhatsApp message or image:', error);
    throw new Error('Message sending failed');
  }
};

const sendOrderConfirmationWhatsAppMessage = async (orderId,dfcPaymentId, phone, name, plan, deliveryDate, orderType) => {
  const client = getWhatsAppClient(); // Use the initialized client
  const formattedPhone = phone.startsWith('91') ? `${phone}@c.us` : `91${phone}@c.us`;

  const whatsappMessage = `Hello ${name},\n\n✨ Great news! Your payment for Order ID: ${orderId} is successfully confirmed. 🏦\n\n💳 Payment ID: ${dfcPaymentId}\n\nYour order is now confirmed and scheduled for delivery. 🚛💨\n\nOrder details:\n🌟 Plan: ${plan}\n📅 Delivery Date: ${deliveryDate}\n📦 Type: ${orderType}\n\nWe're excited to deliver the freshest fruits to your doorstep! 🥝🍇🍎\n\nThank you for choosing Daily Fruit Co.!\nWarm regards,\n🍎 The Daily Fruit Co. Team`;

  try {
    const media = MessageMedia.fromFilePath('./acceptO.png'); // Path to your confirmation image
    await client.sendMessage(formattedPhone, media, { caption: whatsappMessage });
    logger.info('Order confirmation message sent successfully');
  } catch (error) {
    console.error('Failed to send WhatsApp message or image:', error);
    throw new Error('Message sending failed');
  }
};

const sendOrderRejectedWhatsAppMessage = async (orderId, phone, name, plan, orderType) => {
  const client = getWhatsAppClient(); // Use the initialized client
  const formattedPhone = phone.startsWith('91') ? `${phone}@c.us` : `91${phone}@c.us`;

  const whatsappMessage = `Hello ${name},\n\nWe regret to inform you that your order (Order ID: ${orderId}) for the ${plan} ${orderType} could not be processed at this time due to our delivery policies or service limitations in your area. 🚫\n\nWe sincerely apologize for this inconvenience and want to assure you that we are working to expand our service coverage. 🗺️\n\nWe truly value your interest in Daily Fruit Co, and we look forward to serving you as soon as we start operations in your location. 🌟\n\nThank you for your understanding and patience.\n\nWarm regards,\nThe Daily Fruit Co Team 🍎`;

  try {
    const media = MessageMedia.fromFilePath('./order_rejected.png'); // Path to your rejection-related image
    await client.sendMessage(formattedPhone, media, { caption: whatsappMessage });
    logger.info('Rejection message sent successfully');
  } catch (error) {
    console.error('Failed to send WhatsApp rejection message or image:', error);
    throw new Error('Message sending failed');
  }
};


const sendQrCodeWhatsAppMessage = async (orderId, phone, name, plan, deliveryDate, orderType) => {
  const client = getWhatsAppClient(); // Use the initialized client
  const formattedPhone = phone.startsWith('91') ? `${phone}@c.us` : `91${phone}@c.us`;

  console.log(orderType);
  console.log(plan);

  const amount = 
  orderType === "sample" && plan === "Premium Box" ? 149 :
  orderType === "Subscription" && plan === "Premium Box" ? 2899 :
  orderType === "sample" && plan === "Regular Box" ? 99 :
  orderType === "subscription" && plan === "Regular Box" ? 1899 :
  0;

const whatsappMessage = `Hello ${name},\n\nThank you for choosing Daily Fruit Co.! 🎉\n\nOrder details:\n🌟 Plan: ${plan}\n📦 Type: ${orderType}\n📅 Delivery Date: ${deliveryDate}\n🆔 Order ID: ${orderId}\n💰 Amount Payable: ₹${amount}\n\nTo ensure your delivery is prepared as scheduled, please complete the payment of ₹${amount} using the QR code provided. Once confirmed, we’ll process your order promptly.\n\nWe’re thrilled to serve you fresh and healthy treats! 🥝🍎🍇\n\nWarm regards,\n🍎 The Daily Fruit Co. Team`;

  try {
    const media = MessageMedia.fromFilePath('./finalQr.png'); // Path to your image
    await client.sendMessage(formattedPhone, media, { caption: whatsappMessage });
    logger.info('Image sent successfully');
  } catch (error) {
    console.error('Failed to send WhatsApp message or image:', error);
    throw new Error('Message sending failed');
  }
};

module.exports = {
  initializeWhatsAppClient,
  sendEnhancedWhatsAppMessage,
  sendQrCodeWhatsAppMessage,
  sendOrderConfirmationWhatsAppMessage,
  sendOrderRejectedWhatsAppMessage
};
