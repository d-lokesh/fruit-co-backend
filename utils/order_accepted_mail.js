const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendOrderAcceptedEmail = async (order) => {
  // Determine email title and content based on order type
  const isSampleOrder = order.orderType === "sample";
  const A_title = isSampleOrder
    ? `🍎 Your Sample Order Has Been Accepted!`
    : `🍎 Your Subscription Order Has Been Accepted!`;

  const orderMessage = isSampleOrder
    ? `<p class="highlight">Great news! Your sample order is being prepared and will be shipped soon.</p>`
    : `<p class="highlight">Fantastic! Your subscription order is confirmed and is being prepared for delivery.</p>`;

  const A_html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f9fbe7;
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
        border: 2px solid #c5e1a5;
      }
      .header {
        text-align: center;
        background-color: #8bc34a;
        color: white;
        padding: 20px;
        border-radius: 8px 8px 0 0;
      }
      .header .emoji {
        font-size: 50px;
        margin-top: 10px;
      }
      .header h1 {
        margin: 10px 0 0;
      }
      .sub-header {
        text-align: center;
        color: #4caf50;
        font-weight: bold;
        margin: 20px 0;
      }
      .order-details {
        padding: 20px;
        line-height: 1.6;
        color: #333;
      }
      .order-details table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
      }
      .order-details table th,
      .order-details table td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      .order-details table th {
        background-color: #8bc34a;
        color: white;
      }
      .highlight {
        color: #2e7d32;
        font-weight: bold;
        font-size: 16px;
        text-align: center;
        margin: 10px 0;
      }
      .button-container {
        text-align: center;
        margin: 20px 0;
      }
      .button-container a {
        background-color: #4caf50;
        color: white;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
      }
      .button-container a:hover {
        background-color: #388e3c;
      }
      .footer {
        text-align: center;
        padding: 20px;
        color: #888;
        background-color: #f9fbe7;
        border-radius: 0 0 8px 8px;
      }
      .footer img {
        max-width: 50px;
        margin: 10px auto;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <div class="emoji">🍎🥜</div>
        <h1>Order Accepted!</h1>
      </div>
      <div class="sub-header">
        "Start your healthy lifestyle journey with Fruit Co!"
      </div>
      <div class="order-details">
        ${orderMessage}
        <b>Here are the details of your order:</b>
        <table>
          <tr>
            <th>Detail</th>
            <th>Information</th>
          </tr>
          <tr>
            <td>OrderId</td>
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
            <td>Plan</td>
            <td>${order.plan}</td>
          </tr>
          <tr>
            <td>Delivery Date</td>
            <td>${new Date(order.deliveryDate).toLocaleString()}</td>
          </tr>
        </table>
        <div class="button-container">
          <a href="http://localhost:3000/check-order-status/${order._id}">Check Order Status</a>
        </div>
      </div>
      <div class="footer">
        <p>Thank you for choosing Fruit Co for your healthy lifestyle needs!</p>
        <img src="https://example.com/path-to-fruit-logo.png" alt="Fruit Co Logo">
        <p>&copy; 2024 Daily Fruit Co. All rights reserved.</p> 
      </div>
    </div>
  </body>
  </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: order.email,
    subject: A_title,
    html: A_html,
  };

  await transporter.sendMail(mailOptions);
};
