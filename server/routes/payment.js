const express = require('express');
const router = express.Router();

// פרטים שאת מקבלת מ-HYP
const TERMINAL_ID = process.env.HYP_TERMINAL;
const RETURN_URL = process.env.HYP_RETURN_URL || "http://miler.co.il/payment-success";

// שלב 1 - יצירת לינק לתשלום
router.post("/create", (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Amount is required" });
  }

  const paymentUrl = `https://pay.hyp.co.il/p/?TerminalNumber=${TERMINAL_ID}&Amount=${amount}&ReturnURL=${RETURN_URL}`;
  res.json({ paymentUrl });
});

// שלב 2 - קבלת תשובה מ-HYP אחרי התשלום
router.get("/success", (req, res) => {
  const { TransId, CCode, Amount } = req.query;

  if (!TransId) {
    return res.status(400).json({ error: "Missing transaction ID" });
  }

  // כאן אפשר לשמור במסד נתונים שהעסקה הצליחה/נכשלה
  console.log("HYP Payment Callback:", req.query);
  sendOrderEmail(order)
  if (CCode === "0") {
    return res.send("✅ התשלום הצליח! מספר עסקה: " + TransId + " סכום: " + Amount + " ₪");

  } else {
    return res.send("❌ התשלום נכשל. קוד שגיאה: " + CCode);
  }
});

module.exports = router;
