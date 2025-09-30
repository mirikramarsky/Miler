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
  console.log("🔹 Generating invoice for order:", orderData.Order, orderData);
  
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
  doc.moveDown().fontSize(14).text(fixRTL(`שם   :   ${orderData.name || ""}`), { align: "right" });
  doc.text(fixRTL(`טלפון   :   ${orderData.phone || ""}`), { align: "right" });
  doc.text(fixRTL(`כתובת   :   ${orderData.address || ""}`), { align: "right" });
  doc.text(fixRTL(`עיר   :   ${orderData.city || ""}`), { align: "right" });
  doc.text(fixRTL(`מיקוד  :   ${orderData.zip || ""}`), { align: "right" });

  // טבלה לפרטי ההזמנה
  doc.moveDown().fontSize(16).text(fixRTL("פרטי   הזמנה   :"), { align: "right", width: doc.page.width - 100 });
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
  doc.moveDown(2)
    .fontSize(14)
    .text(fixRTL(`לתשלום  :  ${total}  ₪`), {
      align: "left",      // מיקום בצד שמאל
      width: doc.page.width - 100,  // מספיק מקום למלל
      lineBreak: false    // מונע שבירת שורה אוטומטית
    });

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

  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  doc.fontSize(12).text(fixRTL(footerText), 50, pageHeight - 300, {
    align: "center",
    lineGap: 4,
    width: doc.page.width - 100
  });

  doc.end();
  console.log("🔹 Generating invoice at:", outputPath);

  return new Promise((resolve, reject) => {
    stream.on("finish", () => resolve(outputPath));
    stream.on("error", reject);
  });
}

module.exports = generateInvoice;
