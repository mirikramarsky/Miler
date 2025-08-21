const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');
const app = express();
const PORT = 3000;
const productsRouter = require('./routes/products.js');
const adminRouter = require('./routes/admin.js');
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use('/products', productsRouter);
app.use('/admin', adminRouter);
require('dotenv').config();

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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
