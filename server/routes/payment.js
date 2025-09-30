const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const fs = require("fs").promises;
const fetch = (...args) =>
  import("node-fetch").then(mod => mod.default(...args));
require('dotenv').config();
const path = require("path");
const ordersFilePath = path.join(__dirname, "../orders.json");
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
    await saveOrder(ordernum, { amount, order });
    console.log("🔹after saving in orders.json Creating payment:", { amount, order });

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
const saveOrder = require("../writeToJSON");
const { log } = require("console");

router.get("/hyp-callback", async (req, res) => {
  try {
    const data = req.query;
    console.log("🔹 HYP Callback:", data);

    if (data.CCode !== "0") {
      return res.redirect("https://miler.co.il/payment-failed");
    }
    const orderId = data.Order;

    // קריאה מהקובץ לפי מזהה הזמנה
    const json = await fs.readFile(ordersFilePath, "utf8");
    const orders = JSON.parse(json);
    console.log("🔹 Loaded orders from JSON:", orders);
    console.log("🔹 Current orderId:", orderId);
    
    const orderItems = orders[orderId]?.order || [];
    // ===== יצירת חשבונית PDF =====
    const invoicePath = await generateInvoice({
      zip: data.zip || "00000",
      city: data.city || "עיר",
      address: data.street,
      phone: data.cell,
      name: data.Fild1,
      Order: data.Order,
      Amount: data.Amount,
      email: data.Fild2,
      orderItems,
    });

    // ===== שליחת מייל ללקוח עם החשבונית =====
    const mailToCustomer = {
      from: process.env.EMAIL_USER,
      to: data.email || "customer@example.com",
      subject: `חשבונית מס #${data.Order}`,
      html: "<h3>תודה על הרכישה! מצורפת החשבונית שלך.</h3>",
      attachments: [
        { filename: `invoice_${data.Order}.pdf`, path: invoicePath }
      ],
    };
    const mailToSeller = {
      from: process.env.EMAIL_USER,
      to: process.env.SELLER_EMAIL, // כתובת שלך, תשימי בקובץ .env
      subject: `התקבלה הזמנה חדשה #${data.Order}`,
      html: `
    <h3>התקבלה הזמנה חדשה</h3>
    <p>מספר הזמנה: ${data.Order}</p>
    <p>סכום: ${data.Amount} ₪</p>
    <p>לקוח: ${data.email}</p>
    <br>
    מצורפת החשבונית שנשלחה ללקוח.
  `,
      attachments: [
        { filename: `invoice_${data.Order}.pdf`, path: invoicePath }
      ],
    };
    console.log("🔹 Sending emails to seller and customer");
    
    await transporter.sendMail(mailToSeller);
    await transporter.sendMail(mailToCustomer);
    console.log("✅ Emails sent successfully");
    

    res.redirect(`https://miler.co.il/success?orderId=${data.Order}&amount=${data.Amount}&products=${encodeURIComponent(JSON.stringify(orderItems))}  `);

  } catch (err) {
    console.error("❌ Callback error:", err);
    res.status(500).send("ERROR");
  }
});

// ===========================
// שליחת מייל אחרי הצלחת תשלום
// ===========================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: true,
  logger: true,
  connectionTimeout: 10000, // 10 שניות
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
