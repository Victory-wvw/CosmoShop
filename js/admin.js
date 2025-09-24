class AdminPanel {
    constructor() {
        this.currentProduct = null;
        this.init();
    }

    async init() {
        await this.loadProducts();
        await this.loadCategories();
        this.setupEventListeners();
    }

    async loadProducts() {
        try {
            const response = await fetch('/api/products');
            const products = await response.json();
            this.renderProducts(products);
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error);
        }
    }

    async loadCategories() {
        try {
            const response = await fetch('/api/categories');
            const categories = await response.json();
            this.renderCategorySelect(categories);
        } catch (error) {
            console.error('Ошибка загрузки категорий:', error);
        }
    }

    renderProducts(products) {
        const tbody = document.getElementById('productsTable');
        tbody.innerHTML = products.map(product => `
            <tr>
                <td>${product.id}</td>
                <td><img src="${product.image_url}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover;"></td>
                <td>${product.name}</td>
                <td>${product.price} руб.</td>
                <td>${product.category_name}</td>
                <td>${product.stock_quantity}</td>
                <td>
                    <button class="btn-edit" onclick="admin.editProduct(${product.id})">✏️</button>
                    <button class="btn-delete" onclick="admin.deleteProduct(${product.id})">🗑️</button>
                </td>
            </tr>
        `).join('');
    }

    renderCategorySelect(categories) {
        const select = document.querySelector('select[name="category_id"]');
        select.innerHTML = '<option value="">Выберите категорию</option>' +
            categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
    }

    async editProduct(productId) {
        try {
            const response = await fetch(`/api/products/${productId}`);
            const product = await response.json();
            this.showProductForm(product);
        } catch (error) {
            console.error('Ошибка загрузки товара:', error);
        }
    }

    async deleteProduct(productId) {
        if (confirm('Вы уверены, что хотите удалить этот товар?')) {
            try {
                await fetch(`/api/products/${productId}`, { method: 'DELETE' });
                this.loadProducts();
            } catch (error) {
                console.error('Ошибка удаления товара:', error);
            }
        }
    }

    showProductForm(product = null) {
        this.currentProduct = product;
        const modal = document.getElementById('productModal');
        const form = document.getElementById('productForm');
        const title = document.getElementById('modalTitle');

        if (product) {
            title.textContent = 'Редактировать товар';
            form.name.value = product.name;
            form.description.value = product.description || '';
            form.price.value = product.price;
            form.brand.value = product.brand || '';
            form.category_id.value = product.category_id || '';
            form.stock_quantity.value = product.stock_quantity;
            form.image_url.value = product.image_url || '';
        } else {
            title.textContent = 'Добавить товар';
            form.reset();
        }

        modal.style.display = 'block';
    }

    hideProductForm() {
        document.getElementById('productModal').style.display = 'none';
        this.currentProduct = null;
    }

    async saveProduct(formData) {
        const url = this.currentProduct ? 
            `/api/products/${this.currentProduct.id}` : '/api/products';
        
        const method = this.currentProduct ? 'PUT' : 'POST';

        try {
            await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            this.hideProductForm();
            this.loadProducts();
        } catch (error) {
            console.error('Ошибка сохранения товара:', error);
        }
    }

    setupEventListeners() {
        // Навигация
        document.querySelectorAll('.admin-nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.admin-nav a').forEach(a => a.classList.remove('active'));
                e.target.classList.add('active');
                
                document.querySelectorAll('section').forEach(section => {
                    section.style.display = 'none';
                });
                document.querySelector(e.target.getAttribute('href')).style.display = 'block';
            });
        });

        // Форма товара
        document.getElementById('productForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            this.saveProduct(data);
        });

        // Закрытие модального окна
        document.getElementById('productModal').addEventListener('click', (e) => {
            if (e.target.id === 'productModal') {
                this.hideProductForm();
            }
        });
    }
}

// Инициализация админ-панели
const admin = new AdminPanel();

// Глобальные функции для вызова из HTML
function showProductForm() {
    admin.showProductForm();
}

function hideProductForm() {
    admin.hideProductForm();
}

async exportOrderToPDF(orderId) {
    try {
        const response = await fetch(`/api/orders/${orderId}/pdf`);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `order-${orderId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Ошибка экспорта PDF:', error);
    }
}