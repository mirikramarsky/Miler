const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
const productsRouter = require('./routes/products.js');
const adminRouter = require('./routes/admin.js');
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use('/products', productsRouter);
app.use('/admin', adminRouter);
require('dotenv').config();
const paymentRouter = require('./routes/payment.js');
app.use('/payment', paymentRouter);
const path = require('path');



// ב-server.js שלך
app.post('/checkout', (req, res) => {
  const { customer, cart, total } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // הגדרי בקובץ .env
      pass: process.env.EMAIL_PASS  // או App Password
    }
  });

  const items = cart
    .map(p => `${p.title} - ${p.quantity} x ${p.price} ₪ = ${(p.quantity * p.price).toFixed(2)} ₪`)
    .join('\n');

  const text = `
התקבלה הזמנה חדשה:

פרטי לקוח:
שם: ${customer.firstName} ${customer.lastName}
כתובת: ${customer.address}
טלפון: ${customer.phone}

פרטי סל:
${items}

סה"כ לתשלום: ${Number(total).toFixed(2)} ₪
  `.trim();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ORDER_RECEIVER || process.env.EMAIL_USER, // יעד המייל
    subject: `הזמנה חדשה מאת ${customer.firstName} ${customer.lastName}`,
    text
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("I ahv e a problem");
      
      console.error('Email error:', err);
      return res.status(500).send(err.toString());
    }
    res.json({ success: true });
  });
});
// משרת את קבצי Angular סטטיים
app.use(express.static(path.join(__dirname, 'dist/client2')));
// כל בקשה שלא תואמת ל-route בשרת תוחזר ל-index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/client2/index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
