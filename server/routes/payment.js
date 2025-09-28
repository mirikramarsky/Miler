const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const fetch = (...args) =>
  import("node-fetch").then(mod => mod.default(...args));
require('dotenv').config();

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

    const heshDesc = order.map((item, index) =>
      `[0~${item.title}~${item.quantity}~${item.price}]`
    ).join('');
    console.log("🔹 heshDesc:", heshDesc);

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
    console.log("🔹 Params for APISign:", params.toString());

    const signResponse = await fetch(`https://pay.hyp.co.il/p/?${params.toString()}`);
    const signText = await signResponse.text();
    console.log("🔹 Raw signText from HYP:", signText);
    console.log("Sign response text:", signText); // למעקב

    const urlParams = new URLSearchParams(signText);
    const signature = urlParams.get("signature");
    console.log("🔹 Extracted signature:", signature);
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
    console.log("🔹 Params for pay:", paramsPay.toString());

    const hypPayUrl = `https://pay.hyp.co.il/p/?${paramsPay.toString()}`;
    console.log("✅ HYP Payment URL:", hypPayUrl);

    res.json({ url: hypPayUrl });
  } catch (err) {
    console.error("❌ Payment creation error:", err);
    res.status(500).json({ error: "Failed to create payment" });
  }
  //   const { amount, order } = req.body;

  //   const heshDesc = order.map(item => ({
  //     description: item.title,
  //     quantity: item.quantity,
  //     price: item.price,
  //   }));

  //   // בונים מספר הזמנה
  //   const ordernum = process.env.HYP_TERMINAL + Date.now().toString().slice(-6);

  //   const params = new URLSearchParams({
  //     KEY: process.env.HYP_KEY,
  //     action: "APISign",
  //     What: "SIGN",
  //     PassP: process.env.HYP_PASS,
  //     Order: ordernum,
  //     Masof: process.env.HYP_TERMINAL,
  //     Info: "רכישה באתר מילר סטנדרים",
  //     Amount: amount.toString(),
  //     heshDesc: JSON.stringify(heshDesc),
  //     Sign: "True",
  //     MoreData: "True",
  //     UTF8: "True",
  //     UTF8out: "True",
  //     SendHesh: "True",
  //     Pritim: "True",
  //   });

  //   try {
  //     const signResponse = await fetch(`https://pay.hyp.co.il/p/?${params.toString()}`);
  //     const signText = await signResponse.text();
  //     const signature = new URLSearchParams(signText).get("signature");
  //     console.log("Response to client:", { signature, ordernum });
  //     res.json({ signature, ordernum });
  //   } catch (err) {
  //     console.error("Error getting signature:", err);
  //     res.status(500).json({ error: "Failed to create payment" });
  //   }
});

// ===========================
// Callback מ-HYP אחרי תשלום
// ===========================
// router.get("/hyp-callback", async (req, res) => {
//   try {
//     const data = req.query;
//     console.log("🔹 HYP Callback:", data);

//     // אפשרות: שמירה ל-DB כאן
//     // await savePaymentResult(data);

//     res.send("OK");
//   } catch (err) {
//     console.error("❌ Webhook error:", err);
//     res.status(500).send("ERROR");
//   }
// });
// router.get("/hyp-callback", async (req, res) => {
//   try {
//     const data = req.query; // נתוני התשלום מ-HYP
//     console.log("🔹 HYP Callback:", data);

//     // בדיקה אם התשלום הצליח
//     if (data.Status !== "0") { // HYP מחזיר 0 במידה והכל OK
//       return res.redirect("miler.co.il/payment-failed"); // לדף כשלון
//     }

//     // כאן אפשר לשמור את ההזמנה ב-DB
//     // await savePaymentResult(data);

//     // שליחת מייל למוכר
//     const mailToSeller = {
//       from: process.env.EMAIL_USER,
//       to: process.env.SELLER_EMAIL,
//       subject: `הזמנה חדשה #${data.Order}`,
//       html: `
//         <h3>הזמנה חדשה התקבלה</h3>
//         <p>סכום לתשלום: ${data.Amount} ש"ח</p>
//         <p>מספר הזמנה: ${data.Order}</p>
//       `,
//     };

//     // שליחת מייל ללקוח (אם יש אימייל ב-Query)
//     const mailToCustomer = {
//       from: process.env.EMAIL_USER,
//       to: data.email || "customer@example.com",
//       subject: `תשלום התקבל בהצלחה #${data.Order}`,
//       html: `
//         <h3>תודה על הרכישה!</h3>
//         <p>סכום ששולם: ${data.Amount} ש"ח</p>
//         <p>מספר הזמנה: ${data.Order}</p>
//       `,
//     };

//     await transporter.sendMail(mailToSeller);
//     await transporter.sendMail(mailToCustomer);

//     // בסוף - הפניה לדף הצלחה
//     res.redirect(`miler.co.il/success?orderId=${data.Order}&amount=${data.Amount}&products=${encodeURIComponent(JSON.stringify(orderItems))}`);
//   } catch (err) {
//     console.error("❌ Callback error:", err);
//     res.status(500).send("ERROR");
//   }
// });
const generateInvoice = require("../invoice");

router.get("/hyp-callback", async (req, res) => {
  try {
    const data = req.query;
    console.log("🔹 HYP Callback:", data);

    if (data.Status !== "0") {
      return res.redirect("miler.co.il/payment-failed");
    }

    // דוגמה ל-orderItems, את יכולה להביא אותם מה־DB
    const orderItems = [
      { title: "מוצר א", quantity: 2, price: 50 },
      { title: "מוצר ב", quantity: 1, price: 50 },
    ];

    // ===== יצירת חשבונית PDF =====
    const invoicePath = await generateInvoice({
      Order: data.Order,
      Amount: data.Amount,
      email: data.email,
      orderItems,
    });

    // ===== שליחת מייל ללקוח עם החשבונית =====
    const mailToCustomer = {
      from: process.env.EMAIL_USER,
      to: data.email || "customer@example.com",
      subject: `חשבונית מס #${data.Order}`,
      html: "<h3>תודה על הרכישה! מצורפת החשבונית שלך.</h3>",
      attachments: [{ filename: `invoice_${data.Order}.pdf`, path: invoicePath }],
    };

    await transporter.sendMail(mailToCustomer);

    res.redirect(`miler.co.il/success?orderId=${data.Order}`);
  } catch (err) {
    console.error("❌ Callback error:", err);
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
