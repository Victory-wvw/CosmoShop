const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

console.log('Настройка базы данных для CosmoShop...');

connection.execute('CREATE DATABASE IF NOT EXISTS cosmoshop', (err) => {
    if (err) {
        console.error('Ошибка создания БД:', err);
        process.exit(1);
    }
    
    console.log('База данных создана/проверена');
    connection.end();
    process.exit(0);
});