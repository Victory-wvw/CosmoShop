const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from root directory
app.use(express.static(path.join(__dirname, '..')));

// API Routes
app.get('/api/products', (req, res) => {
    const products = [
        {
            id: 1,
            name: 'Матовое помада "Velvet"',
            brand: 'L\'Oreal',
            price: 1200,
            category: 'decorative',
            image: '../images/product1.jpg',
            description: 'Матовая помада с насыщенным цветом и длительным сроком носки.'
        },
        {
            id: 2,
            name: 'Объемная тушь для ресниц',
            brand: 'Maybelline',
            price: 890,
            category: 'decorative',
            image: '../images/product2.jpg',
            description: 'Тушь для создания объема и длины ресниц.'
        }
    ];
    res.json(products);
});

// Serve main pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/catalog', (req, res) => {
    res.sendFile(path.join(__dirname, '../catalog.html'));
});

app.get('/product-card', (req, res) => {
    res.sendFile(path.join(__dirname, '../product-card.html'));
});

app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, '../cart.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../login.html'));
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'CosmoShop server is running' });
});

// Handle 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../index.html'));
});

// Error handling
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`🚀 CosmoShop server running on http://localhost:${PORT}`);
    console.log(`📁 Serving static files from: ${path.join(__dirname, '..')}`);
});
