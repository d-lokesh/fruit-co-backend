// config.js
module.exports = {
    awsConfig: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID, // AWS Access Key ID
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // AWS Secret Access Key
      region: 'eu-north-1', // AWS region
      bucketName: 'dailyfuritcobucket', // Your S3 bucket name
    },
    whatsappConfig: {
      headless: true,
      authStrategy: 'LocalAuth',
    },
  };
  