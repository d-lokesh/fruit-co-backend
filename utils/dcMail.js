const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendDeliveryConfirmationEmail = async (order) => {
  // Latest delivery date
  const latestDeliveryDate = order.deliveredDates
    ? new Date(order.deliveredDates[order.deliveredDates.length - 1]).toLocaleString()
    : "N/A";

  const deliveryTitle = `🎉 Your ${order.plan} Fruit Box Has Been Delivered!`;

  const deliveryHtml = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4fdf4;
        margin: 0;
        padding: 0;
      }
      .email-container {
        background-color: #ffffff;
        width: 100%;
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border: 2px solid #d4edda;
      }
      .header {
        text-align: center;
        background-color: #28a745;
        color: white;
        padding: 20px;
        border-radius: 8px 8px 0 0;
      }
      .header .celebration-icon {
        font-size: 50px;
        margin-bottom: 10px;
      }
      .details {
        padding: 20px;
        line-height: 1.6;
        color: #333;
      }
      .details table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        font-size: 16px;
      }
      .details table th,
      .details table td {
        border: 1px solid #ddd;
        padding: 12px;
        text-align: left;
      }
      .details table th {
        background-color: #28a745;
        color: white;
        text-transform: uppercase;
        font-weight: bold;
      }
      .footer {
        text-align: center;
        padding: 20px;
        color: #666;
        background-color: #f4fdf4;
        border-radius: 0 0 8px 8px;
      }
      .footer p {
        margin: 10px 0;
        font-size: 14px;
      }
      .footer .healthy-icons {
        font-size: 20px;
        margin-top: 10px;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <div class="celebration-icon">🎉</div>
        <h1>Good News! Your Fruit Box Has Arrived!</h1>
      </div>
      <div class="details">
        <p><b>Dear ${order.name},</b></p>
        <p>We are excited to let you know that your <b>${order.plan} Fruit Box</b> was successfully delivered today. We hope you enjoy the freshest and healthiest fruits as part of your subscription.</p>
        <table>
          <tr>
            <th>Detail</th>
            <th>Information</th>
          </tr>
          <tr>
            <td>Order ID</td>
            <td>${order.orderId}</td>
          </tr>
          <tr>
            <td>Name</td>
            <td>${order.name}</td>
          </tr>
          <tr>
            <td>Address</td>
            <td>${order.address}</td>
          </tr>
          <tr>
            <td>Phone</td>
            <td>${order.phone}</td>
          </tr>
          <tr>
            <td>Delivery Date</td>
            <td>${latestDeliveryDate}</td>
          </tr>
          <tr>
            <td>Plan</td>
            <td>${order.plan}</td>
          </tr>
        </table>
        <p>We look forward to continuing to deliver quality fruits and excellent service to keep you healthy and happy. 🥳</p>
        <p>If you have any feedback or need assistance, feel free to contact us anytime!</p>
      </div>
      <div class="footer">
        <p><b>Wishing You Great Health and Happiness! 🍎🍌🍇</b></p>
        <p>From the Team, Daily Fruit Co</p>
        <p class="healthy-icons">🌿 🥗 💪</p>
        <p>&copy; 2024 Daily Fruit Co. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: order.email,
    subject: deliveryTitle,
    html: deliveryHtml,
  };

  await transporter.sendMail(mailOptions);
};
