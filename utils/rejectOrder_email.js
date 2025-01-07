const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendOrderRejectedEmail = async (order) => {
  // Determine email title and rejection message based on order type
  const isSampleOrder = order.orderType === "sample";
  const R_title = isSampleOrder
    ? `❌ Sample Order Rejected`
    : `❌ Subscription Order Rejected`;

  const rejectionMessage = isSampleOrder
    ? `<p>We regret to inform you that your sample order at Daily Fruit Co. has been rejected.</p>`
    : `<p>We regret to inform you that your subscription plan at Daily Fruit Co. has been rejected.</p>`;

  const R_html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #fdecea;
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
        border: 2px solid #f5c6cb;
      }
      .header {
        text-align: center;
        background-color: #e3342f; /* bg-red-600 */
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
        background-color: #e3342f; /* bg-red-600 */
        color: white;
        text-transform: uppercase;
        font-weight: bold;
      }
      .reason {
        background-color: #fdecea;
        color: #e3342f; /* text-red-600 */
        padding: 10px;
        border-radius: 8px;
        margin: 20px 0;
        font-size: 14px;
      }
      .footer {
        text-align: center;
        padding: 20px;
        color: #666;
        background-color: #fdecea;
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
        <div class="icon">❌</div>
        <h1>${isSampleOrder ? "Sample Order Rejected" : "Subscription Order Rejected"}</h1>
      </div>
      <div class="order-details">
        ${rejectionMessage}
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
        <div class="reason">
          <b>Reason for Rejection:</b>
          <p>${order.moreInfo || "No additional details provided."}</p>
        </div>
      </div>
      <div class="footer">
        <p>We're sorry for the inconvenience caused. If you have any questions or need further assistance, please contact us at dailyfruitco.in@gmail.com.</p>
        <p>&copy; 2024 Daily Fruit Co. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: order.email,
    subject: R_title,
    html: R_html,
  };

  await transporter.sendMail(mailOptions);
};
