const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendOrderAcceptedEmail = async (order) => {
  const isSampleOrder = order.orderType === "sample";
  const A_title = isSampleOrder
    ? `🍎💳 Payment Received & Sample Order Accepted!`
    : `🍎💳 Payment Received & Subscription Order Confirmed!`;

  const orderMessage = isSampleOrder
    ? `<p class="highlight">Thank you! Your payment has been received 💳, and your sample order is being prepared for delivery.</p>`
    : `<p class="highlight">Thank you! Your payment has been received 💳, and your subscription order is confirmed. Your order will be delivered as scheduled.</p>`;

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
        background-color: #4a5568; /* bg-gray-800 */
        color: #48bb78; /* text-green-500 */
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
        color: #48bb78; /* text-green-500 */
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
        border-radius: 8px;
        overflow: hidden;
      }
      .order-details table th,
      .order-details table td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #e0e0e0;
      }
      .order-details table th {
        background-color: #4a5568; /* bg-gray-800 */
        color: #ffffff;
        text-transform: uppercase;
        font-size: 14px;
      }
      .order-details table tr:nth-child(even) {
        background-color: #f3f4f6; /* lighter row background */
      }
      .order-details table tr:hover {
        background-color: #e0e0e0; /* hover effect */
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
        display: inline-block;
        padding: 12px 24px;
        background-color: #4a5568; /* bg-gray-800 */
        color: #48bb78; /* text-green-500 */
        text-decoration: none;
        border-radius: 8px;
        font-weight: bold;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* shadow-lg */
        transition: all 0.3s ease-in-out;
      }
      .button-container a:hover {
        background-color: #2d3748; /* hover:bg-gray-700 */
        color: white; /* hover:text-white */
      }
      .footer {
        text-align: center;
        padding: 20px;
        color: #888;
        background-color: #f9fbe7;
        border-radius: 0 0 8px 8px;
      }
      .footer img {
        max-width: 80px;
        margin: 10px auto;
        display: block;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <div class="emoji">🍎💳</div>
        <h1>Payment Received & Order Accepted!</h1>
      </div>
      <div class="sub-header">
        "Thank you for starting your healthy lifestyle journey with Daily Fruit Co!"
      </div>
      <div class="order-details">
        ${orderMessage}
        <b>Here are the details of your order:</b>
        <table>
          <thead>
            <tr>
              <th>Detail</th>
              <th>Information</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Payment Id</td>
              <td>${order.dfcPaymentId}</td>
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
          </tbody>
        </table>
        <div class="button-container">
          <a href="http://localhost:3000/check-order-status/">Check Order Status</a>
        </div>
      </div>
      <div class="footer">
        <p>Thank you for choosing Fruit Co for your healthy lifestyle needs!</p>
<img src="data:image/png;base64,BASE64_STRING_HERE" alt="Daily Fruit Co Logo">
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
