CREATE DATABASE IF NOT EXISTS cosmoshop;
USE cosmoshop;

-- Таблица пользователей
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица категорий
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL
);

-- Таблица товаров
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    brand VARCHAR(100),
    category_id INT,
    image_url VARCHAR(500),
    stock_quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Таблица заказов
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'shipped', 'delivered') DEFAULT 'pending',
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Таблица элементов заказа
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Вставляем тестовые данные
INSERT INTO categories (name, slug) VALUES 
('Декоративная косметика', 'decorative'),
('Уход за кожей', 'skincare'),
('Парфюмерия', 'perfume'),
('Волосы', 'haircare');

INSERT INTO products (name, description, price, brand, category_id, image_url, stock_quantity) VALUES 
('Матовое помада "Velvet"', 'Матовое помада с насыщенным цветом', 1200.00, 'L\'Oreal', 1, 'images/product1.jpg', 50),
('Объемная тушь для ресниц', 'Тушь для создания объема', 890.00, 'Maybelline', 1, 'images/product2.jpg', 30),
('Увлажняющий крем для лица', 'Ежедневный уход за кожей', 1500.00, 'Nivea', 2, 'images/product3.jpg', 25);