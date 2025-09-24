const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('../'));

// API для получения товаров
app.get('/api/products', (req, res) => {
    const sql = `
        SELECT p.*, c.name as category_name 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id
    `;
    
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// API для регистрации пользователя
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        db.query(sql, [name, email, hashedPassword], (err, result) => {
            if (err) {
                res.status(400).json({ error: 'Пользователь уже существует' });
                return;
            }
            res.json({ message: 'Регистрация успешна', userId: result.insertId });
        });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// API для авторизации
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
        if (err || results.length === 0) {
            res.status(401).json({ error: 'Неверные учетные данные' });
            return;
        }
        
        const user = results[0];
        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            res.status(401).json({ error: 'Неверные учетные данные' });
            return;
        }
        
        res.json({ 
            message: 'Вход успешен', 
            user: { id: user.id, name: user.name, email: user.email } 
        });
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});

// API для админ-панели
app.get('/api/admin/products', (req, res) => {
    const sql = 'SELECT * FROM products';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/admin/products', (req, res) => {
    const { name, description, price, brand, category_id, stock_quantity, image_url } = req.body;
    const sql = 'INSERT INTO products (name, description, price, brand, category_id, stock_quantity, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    db.query(sql, [name, description, price, brand, category_id, stock_quantity, image_url], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, message: 'Товар добавлен' });
    });
});

app.put('/api/admin/products/:id', (req, res) => {
    const { name, description, price, brand, category_id, stock_quantity, image_url } = req.body;
    const sql = 'UPDATE products SET name=?, description=?, price=?, brand=?, category_id=?, stock_quantity=?, image_url=? WHERE id=?';
    
    db.query(sql, [name, description, price, brand, category_id, stock_quantity, image_url, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Товар обновлен' });
    });
});

app.delete('/api/admin/products/:id', (req, res) => {
    const sql = 'DELETE FROM products WHERE id=?';
    db.query(sql, [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Товар удален' });
    });
});

const PDFGenerator = require('./pdfGenerator');

// API для генерации PDF
app.get('/api/orders/:id/pdf', async (req, res) => {
    try {
        // Получаем данные заказа
        const orderSql = 'SELECT * FROM orders WHERE id = ?';
        const orderItemsSql = `
            SELECT oi.*, p.name 
            FROM order_items oi 
            JOIN products p ON oi.product_id = p.id 
            WHERE oi.order_id = ?
        `;
        const userSql = 'SELECT name, email FROM users WHERE id = ?';
        
        const [order] = await db.promise().query(orderSql, [req.params.id]);
        const [orderItems] = await db.promise().query(orderItemsSql, [req.params.id]);
        const [user] = await db.promise().query(userSql, [order[0].user_id]);
        
        const pdfBuffer = await PDFGenerator.generateOrderPDF(order[0], orderItems, user[0]);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=order-${req.params.id}.pdf`);
        res.send(pdfBuffer);
        
    } catch (error) {
        res.status(500).json({ error: 'Ошибка генерации PDF' });
    }
});