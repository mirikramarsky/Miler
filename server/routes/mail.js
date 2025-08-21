
const nodemailer = require('nodemailer');

function sendOrderEmail(order) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // או SMTP של האתר
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: 'shop@example.com',
    to: 'owner@example.com',
    subject: 'הזמנה חדשה',
    text: `הזמנה מ-${order.customer.firstName} ${order.customer.lastName}, כתובת: ${order.customer.address}, טלפון: ${order.customer.phone}. סה"כ: ${order.total}`
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if(err) console.error(err);
    else console.log('Email sent: ' + info.response);
  });
}
