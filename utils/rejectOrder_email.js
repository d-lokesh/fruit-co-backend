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
    ? `❌ Your Sample Order @ Fruit Co Was Rejected`
    : `❌ Your Subscription Plan @ Fruit Co Was Rejected`;

  const rejectionMessage = isSampleOrder
    ? `<b>We regret to inform you that your sample order at Fruit Co has been rejected.</b>`
    : `<b>We regret to inform you that your subscription order at Fruit Co has been rejected.</b>`;

  const R_html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f8d7da;
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
      }
      .header {
        text-align: center;
        background-color: #dc3545;
        color: white;
        padding: 10px 0;
        border-radius: 8px 8px 0 0;
      }
      .header .crossmark {
        display: inline-block;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: white;
        color: #dc3545;
        text-align: center;
        line-height: 60px;
        font-size: 30px;
        margin-top: 10px;
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
        background-color: #dc3545;
        color: white;
      }
      .reason {
        background-color: #f8d7da;
        color: #721c24;
        padding: 10px;
        border-radius: 5px;
        margin: 20px 0;
      }
      .footer {
        text-align: center;
        padding: 20px;
        color: #888;
        background-color: #f8d7da;
        border-radius: 0 0 8px 8px;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <div class="crossmark">❌</div>
        <h1>Order Rejected</h1>
      </div>
      <div class="order-details">
        ${rejectionMessage}
        <table>
          <tr>
            <th>Detail</th>
            <th>Information</th>
          </tr>
          <tr>
            <td>OrderId</td>
            <td>${order._id}</td>
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
        <p>We're sorry for any inconvenience caused. Please feel free to contact us for further assistance.</p>
        <p>From the Team, Fruit Co</p>
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
