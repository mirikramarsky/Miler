// const PDFDocument = require("pdfkit");
// const fs = require("fs");
// const path = require("path");

// function generateInvoice(data) {
//   return new Promise((resolve, reject) => {
//     const doc = new PDFDocument({ size: "A4", margin: 50 });
//     const filePath = path.join(__dirname, `invoice_${data.Order}.pdf`);
//     const stream = fs.createWriteStream(filePath);

//     doc.pipe(stream);

//     // לוגו למעלה
//     doc.image(path.join(__dirname, "logo.png"), 50, 45, { width: 100 })
//        .fontSize(20)
//        .text("חשבונית / קבלה", 200, 50);

//     doc.moveDown();
//     doc.fontSize(12).text(`מספר הזמנה: ${data.Order}`);
//     doc.text(`סכום לתשלום: ${data.Amount} ש"ח`);
//     doc.text(`דוא"ל לקוח: ${data.email || "לא סופק"}`);

//     doc.end();

//     stream.on("finish", () => resolve(filePath));
//     stream.on("error", reject);
//   });
// }
// invoiceGenerator.js
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

/**
 * generateInvoice
 * @param {Object} orderData
 *   orderData = {
 *     Order: "12345",
 *     Amount: 150,
 *     email: "customer@example.com",
 *     orderItems: [
 *       { title: "מוצר א", quantity: 2, price: 50 },
 *       { title: "מוצר ב", quantity: 1, price: 50 },
 *     ]
 *   }
 */
function generateInvoice(orderData) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const fileName = `invoice_${orderData.Order}.pdf`;
    const filePath = path.join(__dirname, fileName);

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // ===== לוגו וכותרת =====
    const logoPath = path.join(__dirname, "logo.png"); // הכנסי כאן את הלוגו שלך
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 45, { width: 100 });
    }

    doc.fontSize(20).text("חשבונית / קבלה", 200, 50);
    doc.moveDown(2);

    // ===== פרטי הזמנה =====
    doc.fontSize(12)
      .text(`מספר הזמנה: ${orderData.Order}`)
      .text(`סכום לתשלום: ${orderData.Amount} ש"ח`)
      .text(`דוא"ל לקוח: ${orderData.email || "לא סופק"}`)
      .moveDown();

    // ===== רשימת פריטים =====
    doc.fontSize(14).text("פריטים:", { underline: true });
    doc.moveDown(0.5);

    orderData.orderItems.forEach((item, index) => {
      doc.fontSize(12)
        .text(`${index + 1}. ${item.title} - כמות: ${item.quantity} - מחיר ליחידה: ${item.price} ש"ח`);
    });

    doc.moveDown();
    const total = orderData.orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    doc.fontSize(12).text(`סה"כ: ${total} ש"ח`, { bold: true });

    doc.end();

    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
  });
}

module.exports = generateInvoice;
