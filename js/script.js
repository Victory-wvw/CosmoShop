const CosmoShop = {
    products: [
        {
            id: 1,
            name: 'Матовое помада "Velvet"',
            brand: 'L\'Oreal',
            price: 1200,
            category: 'decorative',
            image: 'https://via.placeholder.com/300x300/FFE8E8/333?text=Помада',
            description: 'Матовое помада с насыщенным цветом и длительным сроком носки. Не сушит губы, обеспечивает комфортное нанесение. Идеально подходит для ежедневного использования.'
        },
        {
            id: 2,
            name: 'Объемная тушь для ресниц',
            brand: 'Maybelline',
            price: 890,
            category: 'decorative',
            image: 'https://via.placeholder.com/300x300/FFE8E8/333?text=Тушь',
            description: 'Тушь для создания объема и длины ресниц. Специальная щеточка предотвращает образование комочков. Гипоаллергенная формула подходит для чувствительных глаз.'
        },
        {
            id: 3,
            name: 'Увлажняющий крем для лица',
            brand: 'Nivea',
            price: 1500,
            category: 'skincare',
            image: 'https://via.placeholder.com/300x300/FFE8E8/333?text=Крем',
            description: 'Ежедневный уход за кожей. Глубоко увлажняет и питает кожу, восстанавливает защитный барьер. Подходит для всех типов кожи, включая чувствительную.'
        },
        {
            id: 4,
            name: 'Парфюмированная вода "Chanel №5"',
            brand: 'Chanel',
            price: 4500,
            category: 'perfume',
            image: 'https://via.placeholder.com/300x300/FFE8E8/333?text=Духи',
            description: 'Утонченный аромат с нотками жасмина, розы и ванили. Стойкость до 8 часов. Классический французский парфюм для особых occasions.'
        },
        {
            id: 5,
            name: 'Шампунь для объема волос',
            brand: 'L\'Oreal',
            price: 750,
            category: 'haircare',
            image: 'https://via.placeholder.com/300x300/FFE8E8/333?text=Шампунь',
            description: 'Шампунь для придания объема тонким волосам. Обогащен протеинами и витаминами, укрепляет волосы по всей длине.'
        },
        {
            id: 6,
            name: 'Тональный крем',
            brand: 'Maybelline',
            price: 1300,
            category: 'decorative',
            image: 'https://via.placeholder.com/300x300/FFE8E8/333?text=Тональный',
            description: 'Легкий тональный крем с естественным покрытием. Не забивает поры, подстраивается под тон кожи. SPF 15 защита.'
        }
    ],

    cart: [],
    currentUser: null,
    currentQuantity: 1,

    init: function() {
        this.loadCart();
        this.setupEventListeners();
        this.updateCartCounter();
        
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        
        if (productId && window.location.pathname.includes('product-card.html')) {
            this.loadProductData(parseInt(productId));
        } else if (window.location.pathname.includes('catalog.html')) {
            this.renderProducts();
        } else if (window.location.pathname.includes('index.html')) {
            this.renderFeaturedProducts();
        } else if (window.location.pathname.includes('cart.html')) {
            this.renderCart();
        }
    },

    loadProductData: function(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            this.renderProductDetail(product);
        } else {
            document.getElementById('productDetail').innerHTML = 
                '<div class="loading">Товар не найден</div>';
        }
    },

    renderProductDetail: function(product) {
        const productDetail = document.getElementById('productDetail');
        productDetail.innerHTML = `
            <div class="product-gallery">
                <div class="main-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
            </div>

            <div class="product-info-detail">
                <h2>${product.name}</h2>
                <p class="product-brand">${product.brand}</p>
                <p class="price">${product.price} руб.</p>
                
                <div class="product-options">
                    <div class="option">
                        <label>Цвет:</label>
                        <select id="colorSelect">
                            <option>Красный</option>
                            <option>Розовый</option>
                            <option>Нюд</option>
                        </select>
                    </div>
                </div>

                <div class="product-actions">
                    <div class="quantity">
                        <button type="button" class="qty-btn" onclick="CosmoShop.changeQuantity(-1)">-</button>
                        <span class="qty-value">${this.currentQuantity}</span>
                        <button type="button" class="qty-btn" onclick="CosmoShop.changeQuantity(1)">+</button>
                    </div>
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
    },

    changeQuantity: function(change) {
        this.currentQuantity += change;
        if (this.currentQuantity < 1) this.currentQuantity = 1;
        const qtyElement = document.querySelector('.qty-value');
        if (qtyElement) {
            qtyElement.textContent = this.currentQuantity;
        }
    },

    renderFeaturedProducts: function() {
        const featuredGrid = document.getElementById('featuredProducts');
        if (!featuredGrid) return;

        const featuredProducts = this.products.slice(0, 4);
        
        featuredGrid.innerHTML = featuredProducts.map(product => `
            <div class="product-item" onclick="window.location.href='product-card.html?id=${product.id}'">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
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
    },

    renderProducts: function() {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;

        productsGrid.innerHTML = this.products.map(product => `
            <div class="product-item" onclick="window.location.href='product-card.html?id=${product.id}'">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
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
    },

    addToCart: function(productId) {
        const product = this.products.find(p => p.id === productId);
        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += this.currentQuantity;
        } else {
            this.cart.push({
                ...product,
                quantity: this.currentQuantity
            });
        }
        
        this.currentQuantity = 1;
        this.saveCart();
        this.updateCartCounter();
        this.showNotification('Товар добавлен в корзину!');
        
        if (window.location.pathname.includes('cart.html')) {
            this.renderCart();
        }
    },

    removeFromCart: function(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.renderCart();
        this.updateCartCounter();
    },

    updateCartQuantity: function(productId, change) {
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

    renderCart: function() {
        const cartItems = document.getElementById('cartItems');
        const cartSummary = document.getElementById('cartSummary');
        const emptyCart = document.getElementById('emptyCart');
        
        if (!cartItems) return;

        if (this.cart.length === 0) {
            emptyCart.style.display = 'block';
            cartSummary.style.display = 'none';
            cartItems.innerHTML = '<div class="empty-cart"><p>Ваша корзина пуста</p><a href="catalog.html" class="btn">Перейти к покупкам</a></div>';
            return;
        }

        emptyCart.style.display = 'none';
        cartSummary.style.display = 'block';

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
                    <button class="qty-btn" onclick="CosmoShop.updateCartQuantity(${item.id}, -1)">-</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn" onclick="CosmoShop.updateCartQuantity(${item.id}, 1)">+</button>
                </div>
                <div class="item-total">${item.price * item.quantity} руб.</div>
                <button class="btn-remove" onclick="CosmoShop.removeFromCart(${item.id})">×</button>
            </div>
        `).join('');

        const itemsTotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryCost = itemsTotal > 2000 ? 0 : 300;
        const totalAmount = itemsTotal + deliveryCost;

        document.getElementById('itemsTotal').textContent = `${itemsTotal} руб.`;
        document.getElementById('deliveryCost').textContent = deliveryCost === 0 ? 'Бесплатно' : `${deliveryCost} руб.`;
        document.getElementById('totalAmount').textContent = `${totalAmount} руб.`;
    },

    setupEventListeners: function() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.searchProducts(e.target.value));
        }
    },

    searchProducts: function(query) {
        const filteredProducts = this.products.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.brand.toLowerCase().includes(query.toLowerCase())
        );
        
        const productsGrid = document.getElementById('productsGrid');
        if (productsGrid) {
            productsGrid.innerHTML = filteredProducts.map(product => `
                <div class="product-item" onclick="window.location.href='product-card.html?id=${product.id}'">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
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
        }
    },

    applyFilters: function() {
        const categoryFilters = Array.from(document.querySelectorAll('input[value="decorative"], input[value="skincare"], input[value="perfume"], input[value="haircare"]:checked'))
            .map(input => input.value);
        
        const brandFilters = Array.from(document.querySelectorAll('input[value="L\'Oreal"], input[value="Maybelline"], input[value="Nivea"], input[value="Chanel"]:checked'))
            .map(input => input.value);

        const minPrice = parseInt(document.getElementById('minPrice').value) || 0;
        const maxPrice = parseInt(document.getElementById('maxPrice').value) || Infinity;

        const filteredProducts = this.products.filter(product => {
            const categoryMatch = categoryFilters.length === 0 || categoryFilters.includes(product.category);
            const brandMatch = brandFilters.length === 0 || brandFilters.includes(product.brand);
            const priceMatch = product.price >= minPrice && product.price <= maxPrice;
            
            return categoryMatch && brandMatch && priceMatch;
        });

        const productsGrid = document.getElementById('productsGrid');
        if (productsGrid) {
            productsGrid.innerHTML = filteredProducts.map(product => `
                <div class="product-item" onclick="window.location.href='product-card.html?id=${product.id}'">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
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
        }
    },

    showRegisterForm: function() {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
    },

    showLoginForm: function() {
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
    },

    login: function(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        this.currentUser = { email, name: email.split('@')[0] };
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.showNotification('Вы успешно вошли!');
        setTimeout(() => window.location.href = 'index.html', 1000);
    },

    register: function(event) {
        event.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const confirm = document.getElementById('reg-confirm').value;
        
        if (password !== confirm) {
            this.showNotification('Пароли не совпадают!');
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        users.push({ name, email, password });
        localStorage.setItem('users', JSON.stringify(users));
        
        this.showNotification('Регистрация успешна!');
        this.showLoginForm();
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
        this.updateCartCounter();
    },

    saveCart: function() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    },

    loadCart: function() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
        
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
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
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
};

document.addEventListener('DOMContentLoaded', function() {
    CosmoShop.init();
});
