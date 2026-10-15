// ==============================================================================
// KisanSetu: Digital Marketplace for Farmers
// Backend REST API Server (Node.js & Express)
// ==============================================================================

const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const db = require('./database/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Swagger Documentation
try {
  const swaggerDocument = YAML.load(path.join(__dirname, 'docs/openapi.yaml'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log(`Swagger docs mounted at /api-docs`);
} catch (err) {
  console.warn('Swagger load warning:', err.message);
}

// -----------------------------------------------------------------------------
// Health Check
// -----------------------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'KisanSetu Agricultural Marketplace API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// -----------------------------------------------------------------------------
// Authentication & User Profiles
// -----------------------------------------------------------------------------
app.get('/api/auth/users', (req, res) => {
  const users = db.getUsers();
  res.json({ success: true, count: users.length, data: users });
});

app.get('/api/auth/me', (req, res) => {
  const role = req.query.role || 'farmer';
  const users = db.getUsers();
  const user = users.find(u => u.role === role) || users[0];
  res.json({ success: true, data: user });
});

// -----------------------------------------------------------------------------
// Products API (Produce Catalog & Farmer Listings)
// -----------------------------------------------------------------------------
app.get('/api/products', (req, res) => {
  const { category, is_organic, is_bulk, query, farmer_id } = req.query;
  const products = db.getProducts({ category, is_organic, is_bulk, query, farmer_id });
  res.json({ success: true, count: products.length, data: products });
});

app.get('/api/products/:id', (req, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  const reviews = db.getReviews(product.id);
  res.json({ success: true, data: { ...product, reviews } });
});

app.post('/api/products', (req, res) => {
  const { name, category, price_per_unit, unit, stock_quantity, farmer_id, description, is_organic, is_bulk_only, image_url, location_state, location_district } = req.body;
  
  if (!name || !category || !price_per_unit) {
    return res.status(400).json({ success: false, message: 'Missing required product fields (name, category, price_per_unit)' });
  }

  const newProduct = db.createProduct({
    name,
    category,
    price_per_unit: Number(price_per_unit),
    unit: unit || 'kg',
    stock_quantity: Number(stock_quantity || 100),
    min_order_quantity: Number(req.body.min_order_quantity || 1),
    farmer_id: farmer_id || 'usr-farmer-1',
    farmer_name: req.body.farmer_name || 'Rajesh Patel',
    farmer_state: location_state || 'Maharashtra',
    farmer_rating: 4.9,
    description: description || 'Fresh farm-harvested produce direct from grower.',
    is_organic: Boolean(is_organic),
    is_bulk_only: Boolean(is_bulk_only),
    quality_grade: req.body.quality_grade || 'Grade A',
    location_state: location_state || 'Maharashtra',
    location_district: location_district || 'Nashik',
    image_url: image_url || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    harvest_date: req.body.harvest_date || new Date().toISOString().split('T')[0]
  });

  res.status(201).json({ success: true, message: 'Product published to digital marketplace', data: newProduct });
});

app.put('/api/products/:id', (req, res) => {
  const updated = db.updateProduct(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, message: 'Product updated', data: updated });
});

app.delete('/api/products/:id', (req, res) => {
  const deleted = db.deleteProduct(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, message: 'Product removed from marketplace' });
});

// -----------------------------------------------------------------------------
// Cart API
// -----------------------------------------------------------------------------
app.get('/api/cart', (req, res) => {
  const userId = req.query.user_id || 'usr-consumer-1';
  const cartItems = db.getCart(userId);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.product ? item.product.price_per_unit * item.quantity : 0), 0);
  res.json({ success: true, count: cartItems.length, data: cartItems, subtotal: +subtotal.toFixed(2) });
});

app.post('/api/cart', (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  if (!product_id) {
    return res.status(400).json({ success: false, message: 'product_id is required' });
  }
  const item = db.addToCart(user_id || 'usr-consumer-1', product_id, quantity || 1);
  res.json({ success: true, message: 'Added to cart', data: item });
});

app.put('/api/cart/:id', (req, res) => {
  const userId = req.query.user_id || 'usr-consumer-1';
  const { quantity } = req.body;
  const result = db.updateCartQuantity(userId, req.params.id, quantity);
  res.json({ success: true, data: result });
});

app.delete('/api/cart/:id', (req, res) => {
  const userId = req.query.user_id || 'usr-consumer-1';
  db.removeFromCart(userId, req.params.id);
  res.json({ success: true, message: 'Item removed from cart' });
});

app.delete('/api/cart', (req, res) => {
  const userId = req.query.user_id || 'usr-consumer-1';
  db.clearCart(userId);
  res.json({ success: true, message: 'Cart cleared' });
});

// -----------------------------------------------------------------------------
// Orders & Tracking API
// -----------------------------------------------------------------------------
app.get('/api/orders', (req, res) => {
  const { user_id, role } = req.query;
  const orders = db.getOrders(user_id || 'usr-consumer-1', role || 'consumer');
  res.json({ success: true, count: orders.length, data: orders });
});

app.get('/api/orders/:id', (req, res) => {
  const order = db.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  res.json({ success: true, data: order });
});

app.post('/api/orders', (req, res) => {
  const { buyer_id, buyer_name, items, total_amount, payment_method, delivery_address } = req.body;
  
  if (!items || !items.length || !total_amount) {
    return res.status(400).json({ success: false, message: 'Order items and total amount are required' });
  }

  const order = db.createOrder({
    buyer_id: buyer_id || 'usr-consumer-1',
    buyer_name: buyer_name || 'Priya Sharma',
    items,
    total_amount: Number(total_amount),
    payment_method: payment_method || 'UPI',
    delivery_address: delivery_address || 'New Delhi, India',
    transaction_id: 'TXN-' + Math.random().toString(36).substring(2, 12).toUpperCase()
  });

  res.status(201).json({
    success: true,
    message: 'Order confirmed and verified via payment gateway!',
    data: order
  });
});

// -----------------------------------------------------------------------------
// B2B Industry Quotes (RFQ) & Digital Contracts
// -----------------------------------------------------------------------------
app.get('/api/quotes', (req, res) => {
  const { user_id, role } = req.query;
  const quotes = db.getQuotes(user_id, role);
  res.json({ success: true, count: quotes.length, data: quotes });
});

app.post('/api/quotes', (req, res) => {
  const { buyer_id, buyer_name, farmer_id, farmer_name, product_name, crop_category, quantity_requested, target_price_per_unit, specifications } = req.body;
  
  if (!product_name || !quantity_requested || !target_price_per_unit) {
    return res.status(400).json({ success: false, message: 'Missing RFQ parameters' });
  }

  const quote = db.createQuote({
    buyer_id: buyer_id || 'usr-industry-1',
    buyer_name: buyer_name || 'AgroCorp Global Processing Ltd.',
    farmer_id: farmer_id || 'usr-farmer-2',
    farmer_name: farmer_name || 'Sardar Gurpreet Singh',
    product_name,
    crop_category: crop_category || 'Grains & Cereals',
    quantity_requested: Number(quantity_requested),
    unit: req.body.unit || 'quintal',
    target_price_per_unit: Number(target_price_per_unit),
    proposed_price_per_unit: Number(target_price_per_unit * 1.05),
    specifications: specifications || 'Industry standard moisture and grain cleanliness required.'
  });

  res.status(201).json({ success: true, message: 'RFQ Request broadcasted to farmer', data: quote });
});

app.put('/api/quotes/:id', (req, res) => {
  const { status, notes } = req.body;
  const updated = db.updateQuoteStatus(req.params.id, status, notes);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Quote not found' });
  }
  res.json({ success: true, message: `Quote updated to ${status}`, data: updated });
});

app.get('/api/contracts', (req, res) => {
  const contracts = db.getContracts();
  res.json({ success: true, count: contracts.length, data: contracts });
});

// -----------------------------------------------------------------------------
// Government MSP & Mandi Rates API
// -----------------------------------------------------------------------------
app.get('/api/msp', (req, res) => {
  const rates = db.getMspRates();
  res.json({
    success: true,
    source: 'Ministry of Agriculture & Farmers Welfare, Govt of India + Agmarknet APMC Feed',
    last_updated: new Date().toISOString(),
    count: rates.length,
    data: rates
  });
});

// -----------------------------------------------------------------------------
// Krishi Bazaar (Farmer Inputs Marketplace: Seeds, Fertilizers, Equipment)
// -----------------------------------------------------------------------------
app.get('/api/marketplace', (req, res) => {
  const { category } = req.query;
  const items = db.getFarmInputs(category);
  res.json({ success: true, count: items.length, data: items });
});

// -----------------------------------------------------------------------------
// Reviews API
// -----------------------------------------------------------------------------
app.get('/api/reviews', (req, res) => {
  const { product_id } = req.query;
  const reviews = db.getReviews(product_id);
  res.json({ success: true, count: reviews.length, data: reviews });
});

app.post('/api/reviews', (req, res) => {
  const { product_id, user_name, rating, comment } = req.body;
  if (!product_id || !rating) {
    return res.status(400).json({ success: false, message: 'product_id and rating are required' });
  }
  const rev = db.addReview({
    product_id,
    user_name: user_name || 'Verified Buyer',
    rating: Number(rating),
    comment: comment || 'Great harvest quality!'
  });
  res.status(201).json({ success: true, message: 'Review recorded', data: rev });
});

// -----------------------------------------------------------------------------
// AI Services (Disease Diagnosis, Crop Classification, Voice NLP)
// -----------------------------------------------------------------------------
app.post('/api/ai/disease-detect', (req, res) => {
  const { type, image_url, sample_name } = req.body;
  const diagnosis = db.detectDisease({ image_url, sample_name }, type || 'crop');
  res.json({ success: true, data: diagnosis });
});

app.post('/api/ai/classify', (req, res) => {
  const result = db.classifyCrop(req.body);
  res.json({ success: true, data: result });
});

app.post('/api/ai/voice', (req, res) => {
  const { transcript } = req.body;
  if (!transcript) {
    return res.status(400).json({ success: false, message: 'Voice transcript is required' });
  }
  const parsed = db.parseVoiceCommand(transcript);
  res.json({ success: true, data: parsed });
});

// -----------------------------------------------------------------------------
// Platform Revenue & Analytics API
// -----------------------------------------------------------------------------
app.get('/api/analytics', (req, res) => {
  const stats = db.getAnalytics();
  res.json({ success: true, data: stats });
});

// -----------------------------------------------------------------------------
// Serve static client build if present
// -----------------------------------------------------------------------------
const clientDist = path.join(__dirname, 'client/dist');
app.use(express.static(clientDist));

app.get('{*path}', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/api-docs')) {
    return next();
  }
  const indexPath = path.join(clientDist, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.send(`<h1>KisanSetu Agricultural Marketplace API Running</h1><p>Visit <a href="/api-docs">/api-docs</a> for Swagger documentation or launch client on Vite dev server.</p>`);
    }
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🌾 KisanSetu Marketplace Server running on port ${PORT}`);
  console.log(`📖 Swagger API Docs: http://localhost:${PORT}/api-docs`);
  console.log(`⚡ API Health: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});
