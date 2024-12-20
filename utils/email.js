const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.Email_User,
    pass: process.env.Email_pass,
  },
});

const C_title = `Congratulations Order Placed @ Fruit Co`;

exports.sendOrderPlacedEmail = async (order) => {

  const orderStatusUrl = `http://localhost:3000/check-order-status/${order._id}`;

  const C_html = `<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
  <style> body { font-family: Arial, sans-serif; background-color: #f0f0f0; margin: 0; padding: 0; } .email-container { background-color: #ffffff; 
  width: 100%; max-width: 600px; margin: 20px auto; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
  background-image: url('https://example.com/path-to-your-background-image.jpg'); 
  background-size: cover; background-repeat: no-repeat; background-position: center; } .header { text-align: center; 
  background-color: #4CAF50; color: white; padding: 10px 0; border-radius: 8px 8px 0 0; } .header .checkmark { display: inline-block; width: 60px;
   height: 60px; border-radius: 50%; background-color: white; color: #4CAF50; text-align: center; line-height: 60px; font-size: 30px; 
   margin-top: 10px; } .order-details { padding: 20px; line-height: 1.6; color: #333; } .order-details table { width: 100%; border-collapse: collapse; 
   margin: 20px 0; } .order-details table th, .order-details table td { border: 1px solid #ddd; 
   padding: 8px; text-align: left; } .order-details table th { background-color: #4CAF50; color: white; } .footer { text-align: center; padding: 20px; 
   color: #888; background-color: #f0f0f0; border-radius: 0 0 8px 8px; } .button-container { text-align: center; margin: 20px 0;
    } .button-container a { background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;
      } .button-container a:hover { background-color: #45a049; } </style> </head> <body> <div class="email-container"> 
       <div class="header"> <div class="checkmark">✔️</div> <h1>Order Placed and Under Review</h1> </div> 
       <div class="order-details"> 
       <b>Thank you for your order at Fruit Co. Your order is currently under review. You will receive an update via email shortly.</b> 
       <p>In the meantime, here are your order details:</p>
       <table> <tr> <th>Detail</th> <th>Information</th> 
       </tr><tr> <td>OrderId</td> <td>${order._id}</td> </tr> <tr> <td>Name</td> <td>${order.name}</td> </tr> 
       <tr> <td>Address</td> <td>${order.address}</td> </tr> <tr> <td>Phone</td> <td>${order.phone}</td> </tr> 
       <tr> <td>Plan</td> <td>${order.plan}</td> </tr> <tr> <td>Delivery Date</td> <td>${order.deliveryDate.toLocaleString()}</td> 
       </tr> </table> 
       <div class="button-container"> 
         <a href="${orderStatusUrl}">Check Order Status</a> 
       </div> 
       </div> 
       <div class="footer"> 
         <p>Thank you for choosing us!</p> 
         <p>From the Team, Fruit Co</p> 
         <p>&copy; 2024 Fruit Bowl. All rights reserved.</p> 
       </div> 
       </div> </body> </html>`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: order.email,
    subject: C_title,
    html: C_html,
  };

  await transporter.sendMail(mailOptions);
};
