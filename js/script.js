// Основной объект приложения
const CosmoShop = {
    // Данные товаров
    products: [
        {
            id: 1,
            name: 'Матовое помада "Velvet"',
            brand: 'L\'Oreal',
            price: 1200,
            category: 'decorative',
            image: 'images/product1.jpg',
            description: 'Матовое помада с насыщенным цветом и длительным сроком носки.'
        },
        {
            id: 2,
            name: 'Объемная тушь для ресниц',
            brand: 'Maybelline',
            price: 890,
            category: 'decorative',
            image: 'images/product2.jpg',
            description: 'Тушь для создания объема и длины ресниц.'
        },
        // Добавьте еще товаров...
    ],

    // Корзина
    cart: [],

    // Текущий пользователь
    currentUser: null,

    // Инициализация приложения
    init: function() {
        this.loadCart();
        this.setupEventListeners();
        this.loadExchangeRate(); // Загрузка курса валют
        this.renderProducts();
    },

    // Работа с API курса валют
    async loadExchangeRate() {
        try {
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/RUB');
            const data = await response.json();
            const usdRate = data.rates.USD;
            
            // Добавляем отображение цены в долларах
            document.querySelectorAll('.price').forEach(priceElement => {
                const rubPrice = parseInt(priceElement.textContent);
                if (!isNaN(rubPrice)) {
                    const usdPrice = (rubPrice * usdRate).toFixed(2);
                    priceElement.innerHTML += ` <small>($${usdPrice})</small>`;
                }
            });
        } catch (error) {
            console.log('Не удалось загрузить курс валют');
        }
    },

    // Рендер товаров в каталоге
    renderProducts: function() {
        const productsGrid = document.querySelector('.products-grid');
        if (!productsGrid) return;

        productsGrid.innerHTML = this.products.map(product => `
            <div class="product-item" data-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p class="brand">${product.brand}</p>
                    <p class="price">${product.price} руб.</p>
                    <button class="btn-add" onclick="CosmoShop.addToCart(${product.id})">
                        В корзину
                    </button>
                </div>
            </div>
        `).join('');
    },

    // Работа с корзиной
    addToCart: function(productId) {
        const product = this.products.find(p => p.id === productId);
        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.cart.push({...product, quantity: 1});
        }
        
        this.saveCart();
        this.updateCartCounter();
        this.showNotification('Товар добавлен в корзину!');
    },

    removeFromCart: function(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.renderCart();
    },

    updateQuantity: function(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                this.saveCart();
                this.renderCart();
            }
        }
    },

    // Рендер корзины
    renderCart: function() {
        const cartItems = document.querySelector('.cart-items');
        const cartSummary = document.querySelector('.cart-summary');
        
        if (!cartItems) return;

        cartItems.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>${item.brand}</p>
                </div>
                <div class="item-price">${item.price} руб.</div>
                <div class="item-quantity">
                    <button class="qty-btn" onclick="CosmoShop.updateQuantity(${item.id}, -1)">-</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn" onclick="CosmoShop.updateQuantity(${item.id}, 1)">+</button>
                </div>
                <div class="item-total">${item.price * item.quantity} руб.</div>
                <button class="btn-remove" onclick="CosmoShop.removeFromCart(${item.id})">×</button>
            </div>
        `).join('');

        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (cartSummary) {
            cartSummary.innerHTML = `
                <h3>Итого</h3>
                <div class="summary-row">
                    <span>Товары (${this.cart.reduce((sum, item) => sum + item.quantity, 0)}):</span>
                    <span>${total} руб.</span>
                </div>
                <div class="summary-row">
                    <span>Доставка:</span>
                    <span>${total > 2000 ? 'Бесплатно' : '300 руб.'}</span>
                </div>
                <div class="summary-row total">
                    <span>Всего:</span>
                    <span>${total + (total > 2000 ? 0 : 300)} руб.</span>
                </div>
                <button class="btn-checkout" onclick="CosmoShop.checkout()">Оформить заказ</button>
            `;
        }
    },

    // Система авторизации
    setupAuth: function() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const showRegister = document.getElementById('showRegister');
        const showLogin = document.getElementById('showLogin');

        if (showRegister) {
            showRegister.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelector('.auth-form').style.display = 'none';
                document.querySelector('.register-form').style.display = 'block';
            });
        }

        if (showLogin) {
            showLogin.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelector('.auth-form').style.display = 'block';
                document.querySelector('.register-form').style.display = 'none';
            });
        }

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.login();
            });
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.register();
            });
        }
    },

    login: function() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Простая имитация авторизации
        this.currentUser = { email, name: email.split('@')[0] };
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.showNotification('Вы успешно вошли!');
        setTimeout(() => window.location.href = 'index.html', 1000);
    },

    register: function() {
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        users.push({ name, email, password });
        localStorage.setItem('users', JSON.stringify(users));
        
        this.showNotification('Регистрация успешна!');
        document.querySelector('.register-form').style.display = 'none';
        document.querySelector('.auth-form').style.display = 'block';
    },

    // Вспомогательные функции
    saveCart: function() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    },

    loadCart: function() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
    },

    updateCartCounter: function() {
        const counter = document.querySelector('.cart-counter');
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (counter) {
            counter.textContent = totalItems;
        }
    },

    showNotification: function(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #D4AF37;
            color: white;
            padding: 1rem;
            border-radius: 5px;
            z-index: 1000;
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    },

    checkout: function() {
        if (this.cart.length === 0) {
            this.showNotification('Корзина пуста!');
            return;
        }
        
        if (!this.currentUser) {
            this.showNotification('Пожалуйста, войдите в систему');
            setTimeout(() => window.location.href = 'login.html', 1000);
            return;
        }
        
        this.showNotification('Заказ оформлен! Спасибо за покупку!');
        this.cart = [];
        this.saveCart();
        this.renderCart();
    },

    // Настройка обработчиков событий
    setupEventListeners: function() {
        // Фильтрация в каталоге
        const filterInputs = document.querySelectorAll('.filters input');
        filterInputs.forEach(input => {
            input.addEventListener('change', () => this.applyFilters());
        });

        // Поиск товаров
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.searchProducts(e.target.value));
        }

        this.setupAuth();
    },

    applyFilters: function() {
        // Логика фильтрации товаров
        console.log('Применение фильтров...');
    },

    searchProducts: function(query) {
        // Логика поиска товаров
        console.log('Поиск:', query);
    }
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    CosmoShop.init();
    CosmoShop.renderCart();
    CosmoShop.updateCartCounter();
});