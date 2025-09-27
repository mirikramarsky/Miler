// const express = require('express');
// const router = express.Router();
// const nodemailer = require('nodemailer');
// const fetch = (...args) => import('node-fetch').then(mod => mod.default(...args));

// router.post("/create", async (req, res) => {
//   try {
//     const ordernum = process.env.HYP_TERMINAL + Date.now().toString().slice(-6);
//     const { amount, order } = req.body;
//     console.log("Creating payment:", { amount, order });

//     const heshDesc = order.map(item => ({
//       description: item.title,
//       quantity: item.quantity,
//       price: item.price
//     }));

//     const params = new URLSearchParams({
//       KEY: process.env.HYP_KEY,
//       action: "APISign",
//       What: "SIGN",
//       PassP: "yaad.net",
//       Order: ordernum,
//       Masof: process.env.HYP_TERMINAL,
//       Info: " רכישה באתר מילר סטנדרים",
//       UTF8: "True",
//       UTF8out: "True",
//       Amount: amount.toString(),
//       SendHesh: "True",
//       Pritim: "True",
//       heshDesc: JSON.stringify(heshDesc),
//       Sign: "True",
//       MoreData: "True"
//     });

//     // Step 1 – שליחת בקשה ל-APISign
//     const signResponse = await fetch(`https://pay.hyp.co.il/p/?${params.toString()}`);
//     const signText = await signResponse.text();

//     // חליצה נכונה של ה-signature מהתגובה
//     const urlParams = new URLSearchParams(signText);
//     const signature = urlParams.get("signature");

//     // Step 2 – בניית URL לדף תשלום עם ה-signature
//     const paramsPay = new URLSearchParams({
//       ...Object.fromEntries(params.entries()),
//       action: "pay",
//       signature
//     });

//     const hypPayUrl = `https://pay.hyp.co.il/p/?${paramsPay.toString()}`;

//     console.log("HYP Payment URL:", hypPayUrl);
//     res.json({ url: hypPayUrl });

//   } catch (err) {
//     console.error("Payment creation error:", err);
//     res.status(500).json({ error: "Failed to create payment" });
//   }
// });



// // הגדרת Nodemailer
// const transporter = nodemailer.createTransport({
//   service: 'gmail', // או SMTP של המוכר
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });
// router.post("/create", async (req, res) => {
//   try {
//   ordernum = process.env.HYP_TERMINAL + Date.now().toString().slice(-6);
//   const { amount, order } = req.body;
//   const heshDesc = order.map(item => ({
//     description: item.title,
//     quantity: item.quantity,
//     price: item.price
//   }));
//   const params = new URLSearchParams({
//     KEY: process.env.HYP_KEY,
//     action: "APISign",
//     What: "SIGN",
//     PassP: "yaad.net",
//     Order: ordernum,
//     Masof: process.env.HYP_TERMINAL,
//     Info: " רכישה באתר מילר סטנדרים",
//     UTF8: "True",
//     UTF8out: "True",
//     Amount: amount.toString(),
//     SendHesh: "True",
//     Pritim: "True",
//     heshDesc: JSON.stringify(heshDesc) // שולחים כטקסט
//   });

//   const signResponse = await fetch(`https://pay.hyp.co.il/p/?${params.toString()}`);
//   const signature = await signResponse.text();
//   // Step 2 - בניית URL לדף תשלום עם signature
//     const paramsPay = new URLSearchParams({
//       ...Object.fromEntries(signResponse.entries()), // כל הפרמטרים המקוריים
//       action: "pay",
//       signature
//     });
//         const hypPayUrl = `https://pay.hyp.co.il/p/?${paramsPay.toString()}`;

//     console.log("HYP Payment URL:", hypPayUrl);
//     res.json({ url: hypPayUrl });

//   } catch (err) {
//     console.error("Payment creation error:", err);
//     res.status(500).json({ error: "Failed to create payment" });
//   }
// });
// router.get("/hyp-callback", async (req, res) => {
//   try {
//     const data = req.query; // כל הפרמטרים מגיעים ב-Query String

//     console.log("HYP Callback:", data);

//     // למשל - לשמור במסד נתונים
//     // await savePaymentResult({
//     //   transactionId: data.Id,
//     //   code: data.CCode,
//     //   amount: data.Amount,
//     //   approval: data.ACode,
//     //   orderId: data.Order,
//     //   clientName: data.Fild1,
//     //   clientEmail: data.Fild2,
//     //   clientPhone: data.Fild3
//     // });

//     // להחזיר ל-HYP תשובה חיובית (לא חובה, אבל טוב שיהיה)
//     res.send("OK");
//   } catch (err) {
//     console.error("Webhook error:", err);
//     res.status(500).send("ERROR");
//   }
// });
// // שלב 1 – יצירת לינק לתשלום
// // router.post("/create", (req, res) => {
// //   const { amount, order } = req.body;

// //   if (!amount || amount <= 0) {
// //     return res.status(400).json({ error: "Amount is required" });
// //   }

// //   // HYP URL
// //   const paymentUrl = `https://pay.hyp.co.il/p/?TerminalNumber=${TERMINAL_ID}&Amount=${amount}&ReturnURL=${RETURN_URL}`;

// //   // שמור את פרטי ההזמנה בצד שרת או סשן לפי הצורך (או DB)
// //   // כאן רק מחזירים ללקוח
// //   res.json({ paymentUrl });
// // });

// // שלב 2 – דף החזרה אחרי תשלום
// router.post('/payment-success', express.json(), (req, res) => {
//   const paymentData = req.body; // בדקי איך HYP שולח את הנתונים

//   if (paymentData.status === 'success') {
//     const orderDetails = paymentData.order;

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: 'seller@example.com', // כתובת המוכר
//       subject: `הזמנה חדשה #${orderDetails.id}`,
//       html: `
//         <h3>הזמנה חדשה התקבלה</h3>
//         <p>לוח: ${orderDetails.board}</p>
//         <p>מוצרים:</p>
//         <ul>
//           ${orderDetails.products.map(p => `<li>${p.name} - כמות: ${p.quantity}</li>`).join('')}
//         </ul>
//         <p>סה"כ: ${orderDetails.total} ש"ח</p>
//       `
//     };

//     transporter.sendMail(mailOptions)
//       .then(() => res.send('Payment successful, email sent to seller'))
//       .catch(err => res.status(500).send('Error sending email: ' + err.message));
//   } else {
//     res.status(400).send('Payment failed');
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const fetch = (...args) =>
  import("node-fetch").then(mod => mod.default(...args));

// ===========================
// יצירת תשלום HYP
// ===========================
router.post("/create", async (req, res) => {
  try {
    const ordernum = process.env.HYP_TERMINAL + Date.now().toString().slice(-6);
    const { amount, order } = req.body;

    if (!amount || !order) {
      return res.status(400).json({ error: "Missing amount or order details" });
    }

    console.log("🔹 Creating payment:", { amount, order });

    const heshDesc = order.map(item => ({
      description: item.title,
      quantity: item.quantity,
      price: item.price,
    }));

    // בקשה ל-APISign לקבלת חתימה
    const params = new URLSearchParams({
      KEY: process.env.HYP_KEY,
      action: "APISign",
      What: "SIGN",
      PassP: process.env.HYP_PASS,
      Order: ordernum,
      Masof: process.env.HYP_TERMINAL,
      Info: "רכישה באתר מילר סטנדרים",
      UTF8: "True",
      UTF8out: "True",
      Amount: amount.toString(),
      SendHesh: "True",
      Pritim: "True",
      heshDesc: JSON.stringify(heshDesc),
      Sign: "True",
      MoreData: "True",
    });

    const signResponse = await fetch(`https://pay.hyp.co.il/p/?${params.toString()}`);
    const signText = await signResponse.text();

    console.log("Sign response text:", signText); // למעקב

    const urlParams = new URLSearchParams(signText);
    const signature = urlParams.get("signature");

    if (!signature) {
      console.error("❌ Signature not returned:", signText);
      return res.status(500).json({ error: "Failed to get signature" });
    }

    // בניית לינק לתשלום עם החתימה
    const paramsPay = new URLSearchParams({
      KEY: process.env.HYP_KEY,
      PassP: process.env.HYP_PASS,
      Order: ordernum,
      Masof: process.env.HYP_TERMINAL,
      Amount: amount.toString(),
      UTF8: "True",
      UTF8out: "True",
      Info: "רכישה באתר מילר סטנדרים",
      SendHesh: "True",
      Pritim: "True",
      heshDesc: JSON.stringify(heshDesc),
      MoreData: "True",
      Sign: "True",
      action: "pay",
      signature,
    });

    const hypPayUrl = `https://pay.hyp.co.il/p/?${paramsPay.toString()}`;
    console.log("✅ HYP Payment URL:", hypPayUrl);

    res.json({ url: hypPayUrl });
  } catch (err) {
    console.error("❌ Payment creation error:", err);
    res.status(500).json({ error: "Failed to create payment" });
  }
});

// ===========================
// Callback מ-HYP אחרי תשלום
// ===========================
router.get("/hyp-callback", async (req, res) => {
  try {
    const data = req.query;
    console.log("🔹 HYP Callback:", data);

    // אפשרות: שמירה ל-DB כאן
    // await savePaymentResult(data);

    res.send("OK");
  } catch (err) {
    console.error("❌ Webhook error:", err);
    res.status(500).send("ERROR");
  }
});

// ===========================
// שליחת מייל אחרי הצלחת תשלום
// ===========================
const transporter = nodemailer.createTransport({
  service: "gmail", // או SMTP אחר
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/payment-success", express.json(), async (req, res) => {
  try {
    const paymentData = req.body;

    if (paymentData.status !== "success") {
      return res.status(400).send("Payment failed");
    }

    const orderDetails = paymentData.order;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "seller@example.com", // לשנות לכתובת האמיתית
      subject: `הזמנה חדשה #${orderDetails.id}`,
      html: `
        <h3>הזמנה חדשה התקבלה</h3>
        <p>לוח: ${orderDetails.board}</p>
        <p>מוצרים:</p>
        <ul>
          ${orderDetails.products
          .map(p => `<li>${p.name} - כמות: ${p.quantity}</li>`)
          .join("")}
        </ul>
        <p>סה"כ: ${orderDetails.total} ש"ח</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.send("✅ Payment successful, email sent to seller");
  } catch (err) {
    console.error("❌ Email error:", err);
    res.status(500).send("Error sending email");
  }
});

module.exports = router;
