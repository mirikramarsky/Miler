// // const PDFDocument = require("pdfkit");
// // const fs = require("fs");
// // const path = require("path");

// // function generateInvoice(data) {
// //   return new Promise((resolve, reject) => {
// //     const doc = new PDFDocument({ size: "A4", margin: 50 });
// //     const filePath = path.join(__dirname, `invoice_${data.Order}.pdf`);
// //     const stream = fs.createWriteStream(filePath);

// //     doc.pipe(stream);

// //     // לוגו למעלה
// //     doc.image(path.join(__dirname, "logo.png"), 50, 45, { width: 100 })
// //        .fontSize(20)
// //        .text("חשבונית / קבלה", 200, 50);

// //     doc.moveDown();
// //     doc.fontSize(12).text(`מספר הזמנה: ${data.Order}`);
// //     doc.text(`סכום לתשלום: ${data.Amount} ש"ח`);
// //     doc.text(`דוא"ל לקוח: ${data.email || "לא סופק"}`);

// //     doc.end();

// //     stream.on("finish", () => resolve(filePath));
// //     stream.on("error", reject);
// //   });
// // }
// // invoiceGenerator.js
// const PDFDocument = require("pdfkit");
// const fs = require("fs");
// const path = require("path");

// /**
//  * generateInvoice
//  * @param {Object} orderData
//  *   orderData = {
//  *     Order: "12345",
//  *     Amount: 150,
//  *     email: "customer@example.com",
//  *     orderItems: [
//  *       { title: "מוצר א", quantity: 2, price: 50 },
//  *       { title: "מוצר ב", quantity: 1, price: 50 },
//  *     ]
//  *   }
//  */
// function generateInvoice(orderData) {
//   return new Promise((resolve, reject) => {
//     const doc = new PDFDocument({ size: "A4", margin: 50 });
//     const fileName = `invoice_${orderData.Order}.pdf`;
//     const filePath = path.join(__dirname, fileName);

//     const stream = fs.createWriteStream(filePath);
//     doc.pipe(stream);

//     // ===== לוגו וכותרת =====
//     const logoPath = path.join(__dirname, "logo.png"); // הכנסי כאן את הלוגו שלך
//     if (fs.existsSync(logoPath)) {
//       doc.image(logoPath, 50, 45, { width: 100 });
//     }

//     doc.fontSize(20).text("חשבונית / קבלה", 200, 50);
//     doc.moveDown(2);

//     // ===== פרטי הזמנה =====
//     doc.fontSize(12)
//       .text(`מספר הזמנה: ${orderData.Order}`)
//       .text(`סכום לתשלום: ${orderData.Amount} ש"ח`)
//       .text(`דוא"ל לקוח: ${orderData.email || "לא סופק"}`)
//       .moveDown();

//     // ===== רשימת פריטים =====
//     doc.fontSize(14).text("פריטים:", { underline: true });
//     doc.moveDown(0.5);

//     orderData.orderItems.forEach((item, index) => {
//       doc.fontSize(12)
//         .text(`${index + 1}. ${item.title} - כמות: ${item.quantity} - מחיר ליחידה: ${item.price} ש"ח`);
//     });

//     doc.moveDown();
//     const total = orderData.orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
//     doc.fontSize(12).text(`סה"כ: ${total} ש"ח`, { bold: true });

//     doc.end();

//     stream.on("finish", () => resolve(filePath));
//     stream.on("error", reject);
//   });
// }

// module.exports = generateInvoice;
// const PDFDocument = require("pdfkit");
// const fs = require("fs");
// const path = require("path");


// function generateInvoice(orderData, outputPath) {
//    orderData = {
//       Order: "12345",
//       Amount: 150,
//       email: "customer@example.com",
//       items: [
//         { title: "מוצר א", quantity: 2, price: 50 },
//         { title: "מוצר ב", quantity: 1, price: 50 },
//       ]
//     }
//   const doc = new PDFDocument({ margin: 50 });
//   const fontPath = path.join(__dirname, "fonts", "SecularOne-Regular.ttf");

//   // שימוש בפונט שתומך בעברית
//   doc.registerFont("HebrewFont", fontPath);
//   doc.font("HebrewFont");

//   // לוגו
//   doc.image("logo.png", 50, 45, { width: 100 });

//   // כותרת
//   doc.fontSize(20).text("חשבונית מס", { align: "center" });

//   // פרטי לקוח
//   doc.moveDown().fontSize(12).text(`לקוח: ${orderData.customerName}`);
//   doc.text(`אימייל: ${orderData.customerEmail}`);

//   // פרטי פריטים
//   doc.moveDown().text("פרטי הזמנה:");
//   orderData.items.forEach((item, i) => {
//     doc.text(
//       `${i + 1}. ${item.title} - כמות: ${item.quantity} - מחיר ליחידה: ${item.price}₪`
//     );
//   });

//   // סיכום
//   doc.moveDown().fontSize(14).text(`סה"כ לתשלום: ${orderData.Amount}₪`, {
//     align: "right",
//   });

//   // סיום
//   doc.end();
//   doc.pipe(fs.createWriteStream(outputPath));
// }
// module.exports = generateInvoice;
// invoice.js
// const PDFDocument = require("pdfkit");
// const fs = require("fs");
// const path = require("path");

// function generateInvoice(orderData) {
//   const invoiceDir = path.join(__dirname, "invoices");
//   if (!fs.existsSync(invoiceDir)) {
//     fs.mkdirSync(invoiceDir);
//   }

//   const outputPath = path.join(invoiceDir, `invoice_${orderData.Order}.pdf`);
//   const doc = new PDFDocument({ margin: 50 });

//   const fontPath = path.join(__dirname, "fonts", "SecularOne-Regular.ttf");
//   doc.registerFont("HebrewFont", fontPath);
//   doc.font("HebrewFont");

//   const stream = fs.createWriteStream(outputPath);
//   doc.pipe(stream);

//   // לוגו
//   const logoPath = path.join(__dirname, "logo.png");
//   if (fs.existsSync(logoPath)) {
//     doc.image(logoPath, 50, 45, { width: 100 });
//   }

//   // כותרת
//   doc.fontSize(20).text("חשבונית מס", { align: "center" });

//   // פרטי הזמנה
//   doc.moveDown().fontSize(12).text(`מספר הזמנה: ${orderData.Order}`);
//   doc.text(`אימייל: ${orderData.email || ""}`);

//   doc.moveDown().text("פרטי הזמנה:");
//   (orderData.orderItems || []).forEach((item, i) => {
//     doc.text(
//       `${i + 1}. ${item.title} - כמות: ${item.quantity} - מחיר ליחידה: ${item.price}₪`
//     );
//   });

//   // סיכום
//   const total =
//     orderData.Amount ||
//     (orderData.orderItems || []).reduce(
//       (sum, item) => sum + item.price * item.quantity,
//       0
//     );
//   doc.moveDown().fontSize(14).text(`סה"כ לתשלום: ${total}₪`, {
//     align: "right",
//   });

//   doc.end();

//   return new Promise((resolve, reject) => {
//     stream.on("finish", () => resolve(outputPath));
//     stream.on("error", reject);
//   });
// }

// module.exports = generateInvoice;
// const PDFDocument = require("pdfkit");
// const fs = require("fs");
// const path = require("path");

// function generateInvoice(orderData) {
//   const invoiceDir = path.join(__dirname, "invoices");
//   if (!fs.existsSync(invoiceDir)) {
//     fs.mkdirSync(invoiceDir);
//   }

//   const outputPath = path.join(invoiceDir, `invoice_${orderData.Order}.pdf`);
//   const doc = new PDFDocument({ margin: 50, size: "A4" });

//   // טעינת פונט עברי
//   const fontPath = path.join(__dirname, "fonts", "SecularOne-Regular.ttf");
//   doc.registerFont("HebrewFont", fontPath);
//   doc.font("HebrewFont");

//   const stream = fs.createWriteStream(outputPath);
//   doc.pipe(stream);

//   // סימן מים (Watermark)
//   const logoPath = path.join(__dirname, "logo.png");
//   if (fs.existsSync(logoPath)) {
//     const { width, height } = doc.page;
//     doc.opacity(0.1);
//     doc.image(logoPath, width / 4, height / 3, { width: 300 });
//     doc.opacity(1);
//   }

//   // כותרת עם miler.png
//   const headerImg = path.join(__dirname, "miler.png");
//   if (fs.existsSync(headerImg)) {
//     doc.image(headerImg, doc.page.width / 2 - 100, 20, { width: 200 });
//   }

//   doc.moveDown(4).fontSize(20).text("חשבונית מס", {
//     align: "center",
//     characterSpacing: 1,
//   });

//   // פרטי הזמנה
//   doc.moveDown().fontSize(14).text(`מספר הזמנה: ${orderData.Order}`, {
//     align: "right",
//   });
//   doc.text(`אימייל: ${orderData.email || ""}`, { align: "right" });

//   // טבלה לפרטי ההזמנה
//   doc.moveDown().fontSize(16).text("פרטי הזמנה:", { align: "right" });
//   const startY = doc.y + 10;
//   const tableX = 50;
//   const tableWidth = doc.page.width - 100;
//   const rowHeight = 25;
//   const colWidths = [50, 200, 100, 100]; // מס' שורה | פריט | כמות | מחיר

//   // כותרות טבלה
//   const headers = ["#", "פריט", "כמות", "מחיר"];
//   doc.fontSize(12).font("HebrewFont");
//   let x = tableX;
//   headers.forEach((h, i) => {
//     doc.text(h, x, startY, {
//       width: colWidths[i],
//       align: "center",
//     });
//     x += colWidths[i];
//   });

//   // גבולות שורה ראשונה
//   doc.moveTo(tableX, startY - 5)
//     .lineTo(tableX + tableWidth, startY - 5)
//     .stroke();

//   // שורות פריטים
//   (orderData.orderItems || []).forEach((item, i) => {
//     const y = startY + rowHeight * (i + 1);
//     let x = tableX;

//     const row = [
//       i + 1,
//       item.title,
//       item.quantity,
//       `${item.price}₪`,
//     ];

//     row.forEach((cell, j) => {
//       doc.text(cell.toString(), x, y, {
//         width: colWidths[j],
//         align: "center",
//       });
//       x += colWidths[j];
//     });

//     // גבול שורה
//     doc.moveTo(tableX, y - 5)
//       .lineTo(tableX + tableWidth, y - 5)
//       .stroke();
//   });

//   // סיכום
//   const total =
//     orderData.Amount ||
//     (orderData.orderItems || []).reduce(
//       (sum, item) => sum + item.price * item.quantity,
//       0
//     );
//   doc.moveDown(2).fontSize(14).text(`סה"כ לתשלום: ${total}₪`, {
//     align: "right",
//   });

//   // טקסט סיום
//   doc.moveDown(3).fontSize(16).text("תודה שקניתם אצלינו", {
//     align: "center",
//   });
//   doc.fontSize(14).text("מילר", { align: "center" });

//   const footerText = `
// אנו במילר מאמינים שסטנדר לא צריך להיות סתם סטנדר אלא מעץ איכותי ברמה הגבוהה ביותר, וביופי המקסימלי, לבית המדרש, לבית הכנסת או לבית.
// את הסטנדרים ניתן לרכוש כמתנה מכובדת לאדמורי”ם, ראשי ישיבות, רמי”ם, מנהלי תלמוד תורה, מלמדים, חתנים
// ובעצם לכל אחד שרוצה להוקיר ולכבד את יקירו במתנה מכובדת ומוערכת.
// ניתן לרכוש את הסטנדר ללימוד, למסירת שיעורים או הרצאות, ואף לחזן בית הכנסת.
// ליצירת קשר 0527609686
// `;
//   doc.moveDown().fontSize(12).text(footerText, {
//     align: "right",
//     lineGap: 4,
//   });

//   doc.end();

//   return new Promise((resolve, reject) => {
//     stream.on("finish", () => resolve(outputPath));
//     stream.on("error", reject);
//   });
// }

// module.exports = generateInvoice;

const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// פונקציה לעזר - הופכת טקסט RTL נכון (PDFKit לא תומך RTL טבעי)
function fixRTL(text) {
  return text
    .split("\n")
    .map(line => line.split(" ").reverse().join(" "))
    .join("\n");
}

function generateInvoice(orderData) {
  const invoiceDir = path.join(__dirname, "invoices");
  if (!fs.existsSync(invoiceDir)) {
    fs.mkdirSync(invoiceDir);
  }

  const outputPath = path.join(invoiceDir, `invoice_${orderData.Order}.pdf`);
  const doc = new PDFDocument({ margin: 50, size: "A4" });

  // טעינת פונט עברי
  const fontPath = path.join(__dirname, "fonts", "SecularOne-Regular.ttf");
  doc.registerFont("HebrewFont", fontPath);
  doc.font("HebrewFont");

  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  // סימן מים (Watermark)
  const logoPath = path.join(__dirname, "logo.png");
  if (fs.existsSync(logoPath)) {
    const { width, height } = doc.page;
    doc.opacity(0.1);
    doc.image(logoPath, width / 4, height / 3, { width: 300 });
    doc.opacity(1);
  }

  // כותרת עם miler.png
  const headerImg = path.join(__dirname, "miler.png");
  if (fs.existsSync(headerImg)) {
    doc.image(headerImg, doc.page.width / 2 - 100, 20, { width: 200 });
  }

  doc.moveDown(4).fontSize(20).text(fixRTL("חשבו נית  מס"), {
    align: "center",
    characterSpacing: 1,
  });

  // פרטי הזמנה
  doc.moveDown().fontSize(14).text(fixRTL(`מספר   הזמנה   :   ${orderData.Order}`), {
    align: "right",
  });
  doc.text(fixRTL(`אימייל  :   ${orderData.email || ""}`), { align: "right" });
  // פרטי לקוח
  doc.moveDown().fontSize(14).text(fixRTL(`שם   פרטי   :   ${orderData.firstName || ""}`), { align: "right" });
  doc.text(fixRTL(`שם   משפחה   :   ${orderData.lastName || ""}`), { align: "right" });
  doc.text(fixRTL(`טלפון   :   ${orderData.phone || ""}`), { align: "right" });
  doc.text(fixRTL(`כתובת   :   ${orderData.address || ""}`), { align: "right"});
  doc.text(fixRTL(`עיר   :   ${orderData.city || ""}`), { align: "right" });
  doc.text(fixRTL(`מיקוד  :   ${orderData.zip || ""}`), { align: "right" });

  // טבלה לפרטי ההזמנה
  doc.moveDown().fontSize(16).text(fixRTL("פרטי   הזמנה   :"), { align: "right" ,width: doc.page.width - 100 });
  const startY = doc.y + 10;
  const tableX = 50;
  const tableWidth = doc.page.width - 100;
  const rowHeight = 25;
  const colWidths = [100, 100, 200, 50]; // מס' שורה | פריט | כמות | מחיר

  const headers = ["מחיר", "כמות", "פריט", "#"].map(fixRTL);

  // כותרות טבלה
  doc.fontSize(12).font("HebrewFont");
  let x = tableX;
  headers.forEach((h, i) => {
    doc.text(h, x, startY, {
      width: colWidths[i],
      align: "center",
    });
    x += colWidths[i];
  });

  doc.moveTo(tableX, startY - 5)
    .lineTo(tableX + tableWidth, startY - 5)
    .stroke();

  // שורות פריטים
  (orderData.orderItems || []).forEach((item, i) => {
    const y = startY + rowHeight * (i + 1);
    let x = tableX;

    const row = [
      fixRTL(`${item.price}  ₪`),
      item.quantity,
      fixRTL(item.title),
      i + 1
    ];

    row.forEach((cell, j) => {
      doc.text(cell.toString(), x, y, {
        width: colWidths[j],
        align: "center",
      });
      x += colWidths[j];
    });

    doc.moveTo(tableX, y - 5)
      .lineTo(tableX + tableWidth, y - 5)
      .stroke();
  });

  // סיכום
  const total =
    orderData.Amount ||
    (orderData.orderItems || []).reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  // doc.moveDown(2).fontSize(14).text(fixRTL(`   לתשלום  :    ${total}   ₪`),{
  //   align: "center"
  // });
doc.moveDown(2)
   .fontSize(14)
   .text(fixRTL(`לתשלום  :  ${total}  ₪`), {
       align: "left",      // מיקום בצד שמאל
       width: doc.page.width - 100,  // מספיק מקום למלל
       lineBreak: false    // מונע שבירת שורה אוטומטית
   });

  // טקסט סיום
  // doc.moveDown(3).fontSize(16).text(fixRTL("), {
  //   align: "center",
  // });
  // doc.fontSize(14).text(fixRTL(""), { align: "center" });

  const footerText = `
  תודה שקניתם אצלינו
  מילר
אנו    במילר מאמינים שסטנדר לא צריך להיות סתם סטנדר אלא מעץ איכותי ברמה הגבוהה ביותר,
 וביופי המקסימלי, לבית המדרש, לבית הכנסת או לבית.
את   הסטנדרים ניתן לרכוש כמתנה מכובדת לאדמורי”ם, ראשי ישיבות, רמי”ם,
 מנהלי תלמוד תורה, מלמדים, חתנים
ובעצם    לכל אחד שרוצה להוקיר ולכבד את יקירו במתנה מכובדת ומוערכת.
ניתן   לרכוש את הסטנדר ללימוד, למסירת שיעורים או הרצאות, ואף לחזן בית הכנסת.
ליצירת קשר 0527609686  
`;

  // doc.moveDown().fontSize(12).text(fixRTL(footerText), {
  //   align: "center",
  //   lineGap: 4,
  //   width: doc.page.width - 100,
  // });
  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  doc.fontSize(12).text(fixRTL(footerText), 50, pageHeight - 300, {
    align: "center",
    lineGap: 4,
    width: doc.page.width - 100 
  });

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on("finish", () => resolve(outputPath));
    stream.on("error", reject);
  });
}

module.exports = generateInvoice;
// const PDFDocument = require("pdfkit");
// const fs = require("fs");
// const path = require("path");

// function generateInvoice(orderData) {
//   const invoiceDir = path.join(__dirname, "invoices");
//   if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir);
//   function fixRTL(text) {
//     return text
//       .split("\n")
//       .map(line => line.split(" ").reverse().join(" "))
//       .join("\n");
//   }
//   const outputPath = path.join(invoiceDir, `invoice_${orderData.Order}.pdf`);
//   const doc = new PDFDocument({ margin: 50, size: "A4" });

//   // פונט עברי
//   const fontPath = path.join(__dirname, "fonts", "SecularOne-Regular.ttf");
//   doc.registerFont("HebrewFont", fontPath);
//   doc.font("HebrewFont");

//   const stream = fs.createWriteStream(outputPath);
//   doc.pipe(stream);

//   const pageWidth = doc.page.width;
//   const pageHeight = doc.page.height;

//   // סימן מים
//   const logoPath = path.join(__dirname, "logo.png");
//   if (fs.existsSync(logoPath)) {
//     doc.opacity(0.1);
//     doc.image(logoPath, pageWidth / 4, pageHeight / 3, { width: 300 });
//     doc.opacity(1);
//   }

//   // כותרת עם לוגו miler.png
//   const headerImg = path.join(__dirname, "miler.png");
//   if (fs.existsSync(headerImg)) {
//     doc.image(headerImg, pageWidth / 2 - 100, 20, { width: 200 });
//   }

//   doc.moveDown(4).fontSize(20).text("חשבונית מס", {
//     align: "center",
//     characterSpacing: 1,
//   });

//   // פרטי לקוח
//   doc.moveDown().fontSize(12);
//   doc.text(`שם פרטי: ${orderData.firstName || ""}`, { align: "right" });
//   doc.text(`שם משפחה: ${orderData.lastName || ""}`, { align: "right" });
//   doc.text(`טלפון: ${orderData.phone || ""}`, { align: "right" });
//   doc.text(`אימייל: ${orderData.email || ""}`, { align: "right" });
//   doc.text(`כתובת: ${orderData.address || ""}`, { align: "right" });
//   doc.text(`עיר: ${orderData.city || ""}`, { align: "right" });
//   doc.text(`מיקוד: ${orderData.zip || ""}`, { align: "right" });

//   // טבלה להזמנה
//   doc.moveDown().fontSize(16).text("פרטי הזמנה:", { align: "right" });

//   const startY = doc.y + 10;
//   const tableX = 50;
//   const tableWidth = pageWidth - 100;
//   const rowHeight = 25;
//   const colWidths = [50, 200, 100, 100]; // מספר | פריט | כמות | מחיר
//   const headers = ["#", "פריט", "כמות", "מחיר"];

//   let x = tableX;
//   headers.forEach((h, i) => {
//     doc.text(h, x, startY, { width: colWidths[i], align: "center" });
//     x += colWidths[i];
//   });

//   doc.moveTo(tableX, startY - 5).lineTo(tableX + tableWidth, startY - 5).stroke();

//   (orderData.orderItems || []).forEach((item, i) => {
//     const y = startY + rowHeight * (i + 1);
//     x = tableX;
//     const row = [i + 1, item.title, item.quantity, `${item.price}₪`];
//     row.forEach((cell, j) => {
//       doc.text(cell.toString(), x, y, { width: colWidths[j], align: "center" });
//       x += colWidths[j];
//     });
//     doc.moveTo(tableX, y - 5).lineTo(tableX + tableWidth, y - 5).stroke();
//   });

//   // סיכום
//   const total =
//     orderData.Amount ||
//     (orderData.orderItems || []).reduce(
//       (sum, item) => sum + item.price * item.quantity,
//       0
//     );
//   doc.moveDown(2).fontSize(14).text(`סה"כ לתשלום: ${total}₪`, { align: "right" });

//   // טקסט סיום
//   // doc.moveDown(3).fontSize(16).text(", { align: "center" });
//   doc.fontSize(14).text("מילר", { align: "center" });

//   const footerText = `
//   תודה שקניתם אצלינו
// אנו במילר מאמינים שסטנדר לא צריך להיות סתם סטנדר אלא מעץ איכותי ברמה הגבוהה ביותר, וביופי המקסימלי, לבית המדרש, לבית הכנסת או לבית.
// את הסטנדרים ניתן לרכוש כמתנה מכובדת לאדמורי”ם, ראשי ישיבות, רמי”ם, מנהלי תלמוד תורה, מלמדים, חתנים
// ובעצם לכל אחד שרוצה להוקיר ולכבד את יקירו במתנה מכובדת ומוערכת.
// ניתן לרכוש את הסטנדר ללימוד, למסירת שיעורים או הרצאות, ואף לחזן בית הכנסת.
// ליצירת קשר 0527609686
// `;

//   // הפוטר בתחתית הדף, מרווח, ממרכז
//   doc.fontSize(12).text(footerText, 50, pageHeight - 200, {
//     width: pageWidth - 100,
//     align: "center",
//     lineGap: 4,
//   });

//   doc.end();

//   return new Promise((resolve, reject) => {
//     stream.on("finish", () => resolve(outputPath));
//     stream.on("error", reject);
//   });
// }

// module.exports = generateInvoice;
