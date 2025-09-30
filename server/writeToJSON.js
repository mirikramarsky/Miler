const fs = require("fs").promises;
const path = require("path");

const ordersFilePath = path.join(__dirname, "orders.json");

// lock פשוט למניעת כתיבות במקביל
let writeLock = Promise.resolve();

async function saveOrder(orderId, orderData) {
  console.log("🔹 Saving order:", orderId, orderData);
  
  // מחכים לסיום כתיבה קודמת
  writeLock = writeLock.then(async () => {
    let orders = {};
    try {
      const json = await fs.readFile(ordersFilePath, "utf8");
      orders = JSON.parse(json);
    } catch (err) {
      // אם הקובץ לא קיים, מתחילים מאובייקט ריק
      orders = {};
    }

    // הוספה או עדכון הזמנה
    orders[orderId] = orderData;

    // כתיבה חזרה לקובץ
    await fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2), "utf8");
  });

  // מחכים שהכתיבה תסתיים לפני שממשיכים
  await writeLock;
}
module.exports = saveOrder;