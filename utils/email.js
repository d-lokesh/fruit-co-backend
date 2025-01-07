const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendOrderPlacedEmail = async (order) => {
  const orderStatusUrl = `http://localhost:3000/check-order-status/${order._id}`;

  // Determine email title and content based on order type
  const isSampleOrder = order.orderType === "sample";
  const C_title = isSampleOrder
    ? `✔️ Sample Order Confirmed`
    : `✔️ Subscription Order Placed`;

  const orderMessage = isSampleOrder
    ? `<p>🎉 Thank you for requesting a sample box from Fruit Co! Your sample order is being processed and will be shipped soon.</p>`
    : `<p>🎉 Thank you for subscribing to Daily Fruit Co! Your subscription order has been placed successfully and is being reviewed. It will be delivered as per the schedule.</p>`;

  const C_html = `
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
      .header .icon {
        font-size: 50px;
        margin-top: 10px;
      }
      .header h1 {
        margin: 10px 0 0;
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
        font-size: 16px;
      }
      .order-details table th,
      .order-details table td {
        border: 1px solid #ddd;
        padding: 12px;
        text-align: left;
      }
      .order-details table th {
        background-color: #4a5568; /* bg-gray-800 */
        color: #48bb78; /* text-green-500 */
        text-transform: uppercase;
        font-weight: bold;
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
        <div class="icon">✔️</div>
        <h1>${isSampleOrder ? "Sample Order Confirmed" : "Subscription Order Placed"}</h1>
      </div>
      <div class="order-details">
        ${orderMessage}
        <p><b>Order Details:</b></p>
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
            <td>Plan</td>
            <td>${order.plan}</td>
          </tr>
          <tr>
            <td>Delivery Date</td>
            <td>${new Date(order.deliveryDate).toLocaleString()}</td>
          </tr>
        </table>
        <div class="button-container">
          <a href="${orderStatusUrl}">Check Order Status</a>
        </div>
      </div>
      <div class="footer">
        <p>Thank you for choosing Daily Fruit Co! 🍎</p>
        <p>&copy; 2024 Daily Fruit Co. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: order.email,
    subject: C_title,
    html: C_html,
  };

  await transporter.sendMail(mailOptions);
};
