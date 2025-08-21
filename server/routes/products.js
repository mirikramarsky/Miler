const express = require('express');
const multer  =  require('multer');
const path =  require('path');
const fs = require('fs');

const router = express.Router();
const PRODUCTS_FILE = './products.json';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});
const upload = multer({ storage });
// קריאה של המוצרים
router.get('', (req, res) => {
  const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE));
  res.json(products);
});

// מחיקת מוצר
router.delete('/:id', (req, res) => {
  const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE));
  const filtered = products.filter(p => p.id != req.params.id);
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(filtered, null, 2));
  res.json({ success: true });
});
router.put('/:id', upload.single('image'), (req, res) => {
  if(!req.body) return res.status(400).json({ error: 'No data sent' });

  const { title, price } = req.body;
  const image = req.file ? req.file.filename : null;

  const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE));
  const index = products.findIndex(p => p.id == req.params.id);
  if(index === -1) return res.status(404).json({ error: 'Product not found' });

  products[index] = { 
    ...products[index], 
    title, 
    price, 
    image: image || products[index].image 
  };

  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
  res.json(products[index]);
});


router.post('/', upload.single('image'), (req, res) => {
  const { title, price } = req.body;
  const image = req.file.filename;

  const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE));
  const newProduct = {
    id: Date.now(),
    title,
    price,
    image
  };
  products.push(newProduct);
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));

  res.json(newProduct);
});

module.exports = router;
