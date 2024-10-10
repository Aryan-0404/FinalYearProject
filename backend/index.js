const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

// Database Connection With MongoDB (updated connection string)
mongoose.connect(
  "mongodb+srv://Aryan:Aryan@cluster0.wpyhn.mongodb.net/e-commerce",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Image Storage Engine
const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });
app.post("/upload", upload.single('product'), (req, res) => {
  res.json({
    success: 1,
    image_url: `/images/${req.file.filename}`,
  });
});

// Route for Images folder
app.use('/images', express.static('upload/images'));

// Middleware to fetch user from token
const fetchuser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, "secret_ecom");
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
};

// User Schema
const Users = mongoose.model("Users", {
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  cartData: { type: Object },
  date: { type: Date, default: Date.now },
});

// Product Schema
const Product = mongoose.model("Product", {
  id: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number },
  old_price: { type: Number },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});

// Root API Route For Testing
app.get("/", (req, res) => {
  res.send("Root");
});

// User Login
app.post("/login", async (req, res) => {
  let success = false;
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = { user: { id: user.id } };
      success = true;
      const token = jwt.sign(data, "secret_ecom");
      res.json({ success, token });
    } else {
      return res.status(400).json({ success, errors: "Invalid email/password" });
    }
  } else {
    return res.status(400).json({ success, errors: "Invalid email/password" });
  }
});

// User Signup
app.post("/signup", async (req, res) => {
  let success = false;
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({ success, errors: "User already exists" });
  }

  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }

  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });

  await user.save();
  const data = { user: { id: user.id } };
  const token = jwt.sign(data, "secret_ecom");
  success = true;
  res.json({ success, token });
});

// Get All Products
app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  res.send(products);
});

// Get Latest Products
app.get("/newcollections", async (req, res) => {
  let products = await Product.find({});
  let arr = products.slice(-8);
  res.send(arr);
});

// Get Products by Category
app.get("/popularinwomen", async (req, res) => {
  let products = await Product.find({ category: "women" });
  let arr = products.splice(0, 4);
  res.send(arr);
});

// Get Related Products
app.post("/relatedproducts", async (req, res) => {
  const { category } = req.body;
  const products = await Product.find({ category });
  const arr = products.slice(0, 4);
  res.send(arr);
});

// Add Product to Cart
app.post("/addtocart", fetchuser, async (req, res) => {
  let userData = await Users.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
  res.send("Added to cart");
});

// Remove Product from Cart
app.post("/removefromcart", fetchuser, async (req, res) => {
  let userData = await Users.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] !== 0) {
    userData.cartData[req.body.itemId] -= 1;
  }
  await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
  res.send("Removed from cart");
});

// Get Cart Data
app.post("/getcart", fetchuser, async (req, res) => {
  let userData = await Users.findOne({ _id: req.user.id });
  res.json(userData.cartData);
});

// Add Product (Admin)
app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id = products.length > 0 ? products.slice(-1)[0].id + 1 : 1;

  const product = new Product({
    id: id,
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });

  await product.save();
  res.json({ success: true, name: req.body.name });
});

// Remove Product (Admin)
app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  res.json({ success: true, name: req.body.name });
});

// Order Schema
const Order = mongoose.model("Order", {
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  products: { type: Array, required: true },
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Confirm Order Route
app.post("/confirmorder", fetchuser, async (req, res) => {
  const { products, totalAmount } = req.body;

  const order = new Order({
    userId: req.user.id,
    products,
    totalAmount,
  });

  await order.save();
  res.json({ success: true, message: "Order confirmed", order });
});

// Start Express Server
app.listen(port, (error) => {
  if (!error) console.log("Server Running on port " + port);
  else console.log("Error: ", error);
});
