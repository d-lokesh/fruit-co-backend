const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendAdminNotificationEmail = async (order) => {
  // Dynamic email title based on order type
  const isSampleOrder = order.orderType === "sample";
  const adminTitle = isSampleOrder
    ? `📦 New Sample Order Received @ Daily Fruit Co`
    : `📦 New Subscription Plan Order Received @ Daily Fruit Co`;

  const adminPortalUrl = `https://dfc-admin-portal.netlify.app`;

  const adminHtml = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
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
        border: 2px solid #c8e6c9;
      }
      .header {
        text-align: center;
        background-color: #28a745;
        color: white;
        padding: 20px;
        border-radius: 8px 8px 0 0;
      }
      .header .icon {
        font-size: 50px;
        margin-bottom: 10px;
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
        background-color: #28a745;
        color: white;
        text-transform: uppercase;
        font-weight: bold;
      }
      .button-container {
        text-align: center;
        margin: 20px 0;
      }
      .button-container a {
        background-color: #28a745;
        color: white;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 5px;
        font-size: 16px;
      }
      .button-container a:hover {
        background-color: #218838;
      }
      .footer {
        text-align: center;
        padding: 20px;
        color: #666;
        background-color: #f9f9f9;
        border-radius: 0 0 8px 8px;
      }
      .footer p {
        margin: 10px 0;
        font-size: 14px;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <div class="icon">📦</div>
        <h1>${isSampleOrder ? "New Sample Order" : "New Subscription Plan Order"}</h1>
      </div>
      <div class="order-details">
        <p><b>A new order has been placed on Daily Fruit Co. Please review the details below:</b></p>
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
          <tr>
            <td>Order Type</td>
            <td>${isSampleOrder ? "Sample Order" : "Subscription Plan"}</td>
          </tr>
        </table>
        <div class="button-container">
          <a href="${adminPortalUrl}">View Order in Admin Portal</a>
        </div>
      </div>
      <div class="footer">
        <p><b>Next Steps:</b> Log in to the admin portal to review, confirm, and process the order. You can also contact the customer directly for clarifications.</p>
        <p>From the Team, Daily Fruit Co</p>
        <p>&copy; 2024 Daily Fruit Co. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL, // Admin email address
    subject: adminTitle,
    html: adminHtml,
  };

  await transporter.sendMail(mailOptions);
};
