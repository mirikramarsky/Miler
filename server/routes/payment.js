const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// פרטי HYP
const TERMINAL_ID = process.env.HYP_TERMINAL;
const RETURN_URL = process.env.HYP_RETURN_URL || "http://miler.onrender.com/payment-success";

// הגדרת Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // או SMTP של המוכר
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
router.post("/create", (req, res) => {
  const { amount , order} = req.body;
const heshDesc = order.map(item => ({
    description: item.title,
    quantity: item.quantity,
    price: item.price
  }));
  const params = new URLSearchParams({
    action: "pay",
    Masof: process.env.HYP_TERMINAL,
    Info: " רכישה באתר מילר סטנדרים",
    UTF8: "True",
    UTF8out: "True",
    Amount: amount.toString(),
    SendHesh: "True",
    Pritim: "True",
    heshDesc: JSON.stringify(heshDesc) // שולחים כטקסט
  });

  const hypUrl = `https://pay.hyp.co.il/paypage.aspx?${params.toString()}`;
  res.json({ url: hypUrl });
});
router.get("/hyp-callback", async (req, res) => {
  try {
    const data = req.query; // כל הפרמטרים מגיעים ב-Query String

    console.log("HYP Callback:", data);

    // למשל - לשמור במסד נתונים
    // await savePaymentResult({
    //   transactionId: data.Id,
    //   code: data.CCode,
    //   amount: data.Amount,
    //   approval: data.ACode,
    //   orderId: data.Order,
    //   clientName: data.Fild1,
    //   clientEmail: data.Fild2,
    //   clientPhone: data.Fild3
    // });

    // להחזיר ל-HYP תשובה חיובית (לא חובה, אבל טוב שיהיה)
    res.send("OK");
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).send("ERROR");
  }
});
// שלב 1 – יצירת לינק לתשלום
// router.post("/create", (req, res) => {
//   const { amount, order } = req.body;

//   if (!amount || amount <= 0) {
//     return res.status(400).json({ error: "Amount is required" });
//   }

//   // HYP URL
//   const paymentUrl = `https://pay.hyp.co.il/p/?TerminalNumber=${TERMINAL_ID}&Amount=${amount}&ReturnURL=${RETURN_URL}`;

//   // שמור את פרטי ההזמנה בצד שרת או סשן לפי הצורך (או DB)
//   // כאן רק מחזירים ללקוח
//   res.json({ paymentUrl });
// });

// שלב 2 – דף החזרה אחרי תשלום
router.post('/payment-success', express.json(), (req, res) => {
  const paymentData = req.body; // בדקי איך HYP שולח את הנתונים

  if(paymentData.status === 'success') {
    const orderDetails = paymentData.order;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'seller@example.com', // כתובת המוכר
      subject: `הזמנה חדשה #${orderDetails.id}`,
      html: `
        <h3>הזמנה חדשה התקבלה</h3>
        <p>לוח: ${orderDetails.board}</p>
        <p>מוצרים:</p>
        <ul>
          ${orderDetails.products.map(p => `<li>${p.name} - כמות: ${p.quantity}</li>`).join('')}
        </ul>
        <p>סה"כ: ${orderDetails.total} ש"ח</p>
      `
    };

    transporter.sendMail(mailOptions)
      .then(() => res.send('Payment successful, email sent to seller'))
      .catch(err => res.status(500).send('Error sending email: ' + err.message));
  } else {
    res.status(400).send('Payment failed');
  }
});

module.exports = router;
