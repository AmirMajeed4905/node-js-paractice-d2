const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Product = require("../models/productModel");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ----------------- CRUD Routes --------------------

// CREATE Product
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = req.file ? req.file.filename : null;

    const newProduct = new Product({ title, description, image });
    await newProduct.save();

    res.status(201).json({ message: "Product created", product: newProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ all Products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.render("showProduct", { products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ single Product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE Product
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, description } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // delete old image if new one is uploaded
    if (req.file && product.image) {
      const oldPath = path.join(__dirname, "../uploads", product.image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    product.title = title || product.title;
    product.description = description || product.description;
    product.image = req.file ? req.file.filename : product.image;

    const updated = await product.save();
    res.json({ message: "Updated successfully", product: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE Product
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });

    // delete image file
    if (product.image) {
      const imagePath = path.join(__dirname, "../uploads", product.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
