const CosmoShop = {
    // Данные товаров
    products: [
        {
            id: 1,
            name: 'Матовое помада "Velvet"',
            brand: 'L\'Oreal',
            price: 1200,
            category: 'decorative',
            image: 'https://via.placeholder.com/300x300/FFE8E8/333?text=Помада',
            description: 'Матовое помада с насыщенным цветом и длительным сроком носки. Не сушит губы, обеспечивает комфортное нанесение.'
        },
        {
            id: 2,
            name: 'Объемная тушь для ресниц',
            brand: 'Maybelline',
            price: 890,
            category: 'decorative',
            image: 'https://via.placeholder.com/300x300/FFE8E8/333?text=Тушь',
            description: 'Тушь для создания объема и длины ресниц. Специальная щеточка предотвращает образование комочков.'
        },
        {
            id: 3,
            name: 'Увлажняющий крем для лица',
            brand: 'Nivea',
            price: 1500,
            category: 'skincare',
            image: 'https://via.placeholder.com/300x300/FFE8E8/333?text=Крем',
            description: 'Ежедневный уход за кожей. Глубоко увлажняет и питает кожу, восстанавливает защитный барьер.'
        },
        {
            id: 4,
            name: 'Парфюмированная вода "Chanel №5"',
            brand: 'Chanel',
            price: 4500,
            category: 'perfume',
            image: 'https://via.placeholder.com/300x300/FFE8E8/333?text=Духи',
            description: 'Утонченный аромат с нотками жасмина, розы и ванили. Стойкость до 8 часов.'
        },
        {
            id: 5,
            name: 'Шампунь для объема волос',
            brand: 'L\'Oreal',
            price: 750,
            category: 'haircare',
            image: 'https://via.placeholder.com/300x300/FFE8E8/333?text=Шампунь',
            description: 'Шампунь для придания объема тонким волосам. Обогащен протеинами и витаминами.'
        },
        {
            id: 6,
            name: 'Тональный крем',
            brand: 'Maybelline',
            price: 1300,
            category: 'decorative',
            image: 'https://via.placeholder.com/300x300/FFE8E8/333?text=Тональный',
            description: 'Легкий тональный крем с естественным покрытием. Не забивает поры, подстраивается под тон кожи.'
        },
        {
            id: 7,
            name: 'Палетка теней для век',
            brand: 'NYX',
            price: 1800,
            category: 'decorative',
            image: 'https://via.placeholder.com/300x300/FFE8E8/333?text=Тени',
            description: 'Палетка из 12 стойких оттенков. Подходит для создания дневного и вечернего макияжа.'
        },
        {
            id: 8,
            name: 'Гель для умывания',
            brand: 'La Roche-Posay',
            price: 950,
            category: 'skincare',
            image: 'https://via.placeholder.com/300x300/FFE8E8/333?text=Гель',
            description: 'Мягкий гель для ежедневного умывания. Подходит для чувствительной кожи.'
        }
    ],

    // Корзина
    cart: [],
    
    // Текущий пользователь
    currentUser: null,
    
    // Текущее количество товара
    currentQuantity: 1,

    // Инициализация приложения
    init: function() {
        console.log('🚀 CosmoShop initialized');
        
        this.loadCart();
        this.loadUser();
        this.setupEventListeners();
        this.updateCartCounter();
        
        // Определяем текущую страницу и загружаем соответствующий контент
        this.detectPageAndLoadContent();
    },

    // Определение страницы и загрузка контента
    detectPageAndLoadContent: function() {
        const path = window.location.pathname.toLowerCase();
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        console.log('Current page:', path);
        console.log('Product ID from URL:', productId);

        if (path.includes('product-card') && productId) {
            this.loadProductData(parseInt(productId));
        } else if (path.includes('catalog')) {
            this.renderCatalog();
        } else if (path.includes('cart')) {
            this.renderCart();
        } else if (path.includes('login')) {
            this.setupAuthForms();
        } else {
            // Главная страница или index.html
            this.renderHomePage();
        }
    },

    // Загрузка данных корзины из LocalStorage
    loadCart: function() {
        const savedCart = localStorage.getItem('cosmoshop_cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
            console.log('Cart loaded:', this.cart.length, 'items');
        }
    },

    // Загрузка данных пользователя
    loadUser: function() {
        const savedUser = localStorage.getItem('cosmoshop_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            console.log('User loaded:', this.currentUser);
        }
    },

    // Сохранение корзины в LocalStorage
    saveCart: function() {
        localStorage.setItem('cosmoshop_cart', JSON.stringify(this.cart));
    },

    // Сохранение пользователя
    saveUser: function() {
        if (this.currentUser) {
            localStorage.setItem('cosmoshop_user', JSON.stringify(this.currentUser));
        }
    },

    // Настройка обработчиков событий
    setupEventListeners: function() {
        // Поиск товаров в каталоге
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchProducts(e.target.value);
            });
        }

        // Фильтрация товаров
        const filterInputs = document.querySelectorAll('.filters input');
        filterInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.applyFilters();
            });
        });

        console.log('Event listeners setup completed');
    },

    // Рендер главной страницы
    renderHomePage: function() {
        console.log('Rendering home page');
        this.renderFeaturedProducts();
    },

    // Рендер хитов продаж на главной
    renderFeaturedProducts: function() {
        const featuredGrid = document.getElementById('featuredProducts');
        if (!featuredGrid) {
            console.log('Featured products grid not found on this page');
            return;
        }

        // Берем первые 6 товаров для главной
        const featuredProducts = this.products.slice(0, 6);
        
        featuredGrid.innerHTML = featuredProducts.map(product => `
            <div class="product-item" onclick="CosmoShop.openProduct(${product.id})">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" 
                         onerror="this.src='https://via.placeholder.com/300x300/FFE8E8/333?text=Изображение'">
                </div>
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p class="brand">${product.brand}</p>
                    <p class="price">${product.price} руб.</p>
                    <button class="btn-add" onclick="event.stopPropagation(); CosmoShop.addToCart(${product.id})">
                        В корзину
                    </button>
                </div>
            </div>
        `).join('');

        console.log('Featured products rendered:', featuredProducts.length);
    },

    // Рендер каталога товаров
    renderCatalog: function() {
        console.log('Rendering catalog');
        this.renderProducts();
    },

    // Рендер всех товаров в каталоге
    renderProducts: function(productsToRender = this.products) {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) {
            console.log('Products grid not found on this page');
            return;
        }

        productsGrid.innerHTML = productsToRender.map(product => `
            <div class="product-item" onclick="CosmoShop.openProduct(${product.id})">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" 
                         onerror="this.src='https://via.placeholder.com/300x300/FFE8E8/333?text=Изображение'">
                </div>
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p class="brand">${product.brand}</p>
                    <p class="price">${product.price} руб.</p>
                    <button class="btn-add" onclick="event.stopPropagation(); CosmoShop.addToCart(${product.id})">
                        В корзину
                    </button>
                </div>
            </div>
        `).join('');

        console.log('Products rendered:', productsToRender.length);
    },

    // Открытие страницы товара
    openProduct: function(productId) {
        window.location.href = `product-card.html?id=${productId}`;
    },

    // Загрузка данных товара для страницы товара
    loadProductData: function(productId) {
        console.log('Loading product data for ID:', productId);
        
        const product = this.products.find(p => p.id === productId);
        const productDetail = document.getElementById('productDetail');
        
        if (!productDetail) {
            console.error('Product detail container not found');
            return;
        }

        if (product) {
            productDetail.innerHTML = `
                <div class="product-gallery">
                    <div class="main-image">
                        <img src="${product.image}" alt="${product.name}" 
                             onerror="this.src='https://via.placeholder.com/500x500/FFE8E8/333?text=Изображение'">
                    </div>
                </div>

                <div class="product-info-detail">
                    <h2>${product.name}</h2>
                    <p class="product-brand">${product.brand}</p>
                    <p class="price">${product.price} руб.</p>
                    
                    <div class="product-options">
                        <div class="option">
                            <label>Количество:</label>
                            <div class="quantity">
                                <button type="button" class="qty-btn" onclick="CosmoShop.changeQuantity(-1)">-</button>
                                <span class="qty-value">${this.currentQuantity}</span>
                                <button type="button" class="qty-btn" onclick="CosmoShop.changeQuantity(1)">+</button>
                            </div>
                        </div>
                    </div>

                    <div class="product-actions">
                        <button class="btn-add-to-cart" onclick="CosmoShop.addToCart(${product.id})">
                            Добавить в корзину
                        </button>
                    </div>

                    <div class="product-description">
                        <h3>Описание</h3>
                        <p>${product.description}</p>
                    </div>
                </div>
            `;
            console.log('Product data rendered for:', product.name);
        } else {
            productDetail.innerHTML = `
                <div class="loading" style="grid-column: 1 / -1;">
                    <h3>Товар не найден</h3>
                    <p>Запрошенный товар не существует.</p>
                    <a href="catalog.html" class="btn">Вернуться в каталог</a>
                </div>
            `;
        }
    },

    // Изменение количества товара на странице товара
    changeQuantity: function(change) {
        this.currentQuantity += change;
        if (this.currentQuantity < 1) this.currentQuantity = 1;
        
        const qtyElement = document.querySelector('.qty-value');
        if (qtyElement) {
            qtyElement.textContent = this.currentQuantity;
        }
    },

    // Добавление товара в корзину
    addToCart: function(productId, quantity = this.currentQuantity) {
        const product = this.products.find(p => p.id === productId);
        
        if (!product) {
            this.showNotification('Товар не найден!');
            return;
        }

        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                ...product,
                quantity: quantity
            });
        }
        
        // Сбрасываем количество после добавления
        this.currentQuantity = 1;
        const qtyElement = document.querySelector('.qty-value');
        if (qtyElement) {
            qtyElement.textContent = '1';
        }
        
        this.saveCart();
        this.updateCartCounter();
        this.showNotification(`"${product.name}" добавлен в корзину!`);
        
        // Если находимся на странице корзины - обновляем ее
        if (window.location.pathname.includes('cart')) {
            this.renderCart();
        }
    },

    // Рендер корзины
    renderCart: function() {
        const cartItems = document.getElementById('cartItems');
        const cartSummary = document.getElementById('cartSummary');
        const emptyCart = document.getElementById('emptyCart');
        
        if (!cartItems) {
            console.log('Cart items container not found');
            return;
        }

        if (this.cart.length === 0) {
            if (emptyCart) emptyCart.style.display = 'block';
            if (cartSummary) cartSummary.style.display = 'none';
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <p>Ваша корзина пуста</p>
                    <a href="catalog.html" class="btn">Перейти к покупкам</a>
                </div>
            `;
            return;
        }

        if (emptyCart) emptyCart.style.display = 'none';
        if (cartSummary) cartSummary.style.display = 'block';

        // Рендер товаров в корзине
        cartItems.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}" 
                         onerror="this.src='https://via.placeholder.com/100x100/FFE8E8/333?text=Товар'">
                </div>
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>${item.brand}</p>
                </div>
                <div class="item-price">${item.price} руб.</div>
                <div class="item-quantity">
                    <button class="qty-btn" onclick="CosmoShop.updateCartQuantity(${item.id}, -1)">-</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn" onclick="CosmoShop.updateCartQuantity(${item.id}, 1)">+</button>
                </div>
                <div class="item-total">${item.price * item.quantity} руб.</div>
                <button class="btn-remove" onclick="CosmoShop.removeFromCart(${item.id})">×</button>
            </div>
        `).join('');

        // Обновление итоговой суммы
        this.updateCartTotal();
    },

    // Обновление количества товара в корзине
    updateCartQuantity: function(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                this.saveCart();
                this.renderCart();
                this.updateCartCounter();
            }
        }
    },

    // Удаление товара из корзины
    removeFromCart: function(productId) {
        const itemIndex = this.cart.findIndex(item => item.id === productId);
        if (itemIndex !== -1) {
            const itemName = this.cart[itemIndex].name;
            this.cart.splice(itemIndex, 1);
            this.saveCart();
            this.renderCart();
            this.updateCartCounter();
            this.showNotification(`"${itemName}" удален из корзины`);
        }
    },

    // Обновление итоговой суммы в корзине
    updateCartTotal: function() {
        const itemsTotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryCost = itemsTotal > 2000 ? 0 : 300;
        const totalAmount = itemsTotal + deliveryCost;

        if (document.getElementById('itemsTotal')) {
            document.getElementById('itemsTotal').textContent = `${itemsTotal} руб.`;
            document.getElementById('deliveryCost').textContent = deliveryCost === 0 ? 'Бесплатно' : `${deliveryCost} руб.`;
            document.getElementById('totalAmount').textContent = `${totalAmount} руб.`;
        }
    },

    // Поиск товаров
    searchProducts: function(query) {
        if (!query.trim()) {
            this.renderProducts();
            return;
        }

        const filteredProducts = this.products.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.brand.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase())
        );
        
        this.renderProducts(filteredProducts);
    },

    // Применение фильтров
    applyFilters: function() {
        const categoryFilters = Array.from(document.querySelectorAll('.filter-group input[type="checkbox"]:checked'))
            .map(input => input.value);
        
        const minPrice = parseInt(document.getElementById('minPrice')?.value) || 0;
        const maxPrice = parseInt(document.getElementById('maxPrice')?.value) || 10000;

        const filteredProducts = this.products.filter(product => {
            const categoryMatch = categoryFilters.length === 0 || categoryFilters.some(filter => 
                product.category.includes(filter) || product.brand.includes(filter));
            const priceMatch = product.price >= minPrice && product.price <= maxPrice;
            
            return categoryMatch && priceMatch;
        });

        this.renderProducts(filteredProducts);
    },

    // Настройка форм авторизации
    setupAuthForms: function() {
        const showRegisterLink = document.getElementById('showRegister');
        const showLoginLink = document.getElementById('showLogin');
        
        if (showRegisterLink) {
            showRegisterLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showRegisterForm();
            });
        }
        
        if (showLoginLink) {
            showLoginLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoginForm();
            });
        }
    },

    // Показать форму регистрации
    showRegisterForm: function() {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
    },

    // Показать форму входа
    showLoginForm: function() {
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
    },

    // Вход пользователя
    login: function(event) {
        if (event) event.preventDefault();
        
        const email = document.getElementById('email')?.value;
        const password = document.getElementById('password')?.value;
        
        if (!email || !password) {
            this.showNotification('Заполните все поля');
            return;
        }
        
        this.currentUser = { 
            email: email, 
            name: email.split('@')[0],
            loginTime: new Date().toISOString()
        };
        
        this.saveUser();
        this.showNotification('Вы успешно вошли!');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    },

    // Регистрация пользователя
    register: function(event) {
        if (event) event.preventDefault();
        
        const name = document.getElementById('reg-name')?.value;
        const email = document.getElementById('reg-email')?.value;
        const password = document.getElementById('reg-password')?.value;
        const confirm = document.getElementById('reg-confirm')?.value;
        
        if (!name || !email || !password || !confirm) {
            this.showNotification('Заполните все поля');
            return;
        }
        
        if (password !== confirm) {
            this.showNotification('Пароли не совпадают');
            return;
        }
        
        // Сохраняем пользователя
        const users = JSON.parse(localStorage.getItem('cosmoshop_users') || '[]');
        users.push({ name, email, password, registered: new Date().toISOString() });
        localStorage.setItem('cosmoshop_users', JSON.stringify(users));
        
        this.showNotification('Регистрация успешна!');
        this.showLoginForm();
    },

    // Оформление заказа
    checkout: function() {
        if (this.cart.length === 0) {
            this.showNotification('Корзина пуста!');
            return;
        }
        
        if (!this.currentUser) {
            this.showNotification('Пожалуйста, войдите в систему для оформления заказа');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
            return;
        }
        
        // Сохраняем заказ в историю
        const order = {
            id: Date.now(),
            items: [...this.cart],
            total: this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            user: this.currentUser,
            date: new Date().toISOString(),
            status: 'confirmed'
        };
        
        const orders = JSON.parse(localStorage.getItem('cosmoshop_orders') || '[]');
        orders.push(order);
        localStorage.setItem('cosmoshop_orders', JSON.stringify(orders));
        
        this.showNotification('Заказ успешно оформлен! Спасибо за покупку!');
        
        // Очищаем корзину
        this.cart = [];
        this.saveCart();
        this.renderCart();
        this.updateCartCounter();
    },

    // Обновление счетчика товаров в корзине
    updateCartCounter: function() {
        const counters = document.querySelectorAll('.cart-counter');
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        counters.forEach(counter => {
            counter.textContent = totalItems;
        });
    },

    // Показать уведомление
    showNotification: function(message, type = 'success') {
        // Удаляем предыдущие уведомления
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" style="margin-left: 10px; background: none; border: none; color: white; cursor: pointer;">×</button>
        `;
        
        // Стили для уведомления
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#ff4444' : '#D4AF37'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 5px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-width: 300px;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        // Автоматическое удаление через 4 секунды
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 4000);
    }
};

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    CosmoShop.init();
});

// Добавляем CSS анимацию для уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
