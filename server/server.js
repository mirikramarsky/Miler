const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
const productsRouter = require('./routes/products.js');
const adminRouter = require('./routes/admin.js');
const paymentRouter = require('./routes/payment.js');
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use('/products', productsRouter);
app.use('/admin', adminRouter);
app.use('/payment', paymentRouter);
const path = require('path');

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
