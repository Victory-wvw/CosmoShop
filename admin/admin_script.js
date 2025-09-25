// Админ-панель CosmoShop
class AdminPanel {
    constructor() {
        this.currentProduct = null;
        this.currentUser = null;
        this.currentCategory = null;
        this.uploadedImageName = null;
        this.currentPage = {
            orders: 1,
            products: 1,
            users: 1,
            categories: 1
        };
        this.itemsPerPage = 10;
        this.sortConfig = {};
        this.init();
    }

    init() {
        this.initializeData();
        this.setupNavigation();
        this.setupEventListeners();
        this.showSectionFromHash();
        console.log(' Админ-панель инициализирована');
    }

    initializeData() {
        // Инициализация тестовых данных если их нет
        if (!localStorage.getItem('admin_orders')) {
            this.initializeSampleData();
        }
    }

    initializeSampleData() {
        const sampleOrders = [
            {
                id: 1007,
                user_id: 1,
                user_name: "Анна Петрова",
                user_email: "anna@mail.ru",
                items: [
                    { name: "Парфюмированная вода", quantity: 1, price: 4500 },
                    { name: "Тушь для ресниц", quantity: 2, price: 890 }
                ],
                total: 6280,
                status: "delivered",
                created: "2024-01-15T14:30:00Z",
                address: "г. Москва, ул. Примерная, д. 10"
            },
            {
                id: 1006,
                user_id: 2,
                user_name: "Иван Сидоров",
                user_email: "ivan@mail.ru",
                items: [
                    { name: "Крем для лица", quantity: 1, price: 1500 },
                    { name: "Шампунь для объема", quantity: 1, price: 750 }
                ],
                total: 2250,
                status: "shipped",
                created: "2024-01-14T11:15:00Z",
                address: "г. Санкт-Петербург, пр. Примерный, д. 25"
            }
        ];

        const sampleProducts = [
            {
                id: 1,
                name: "Матовая помада \"Velvet\"",
                brand: "L'Oreal",
                price: 1200,
                category_id: 1,
                description: "Матовое помада с насыщенным цветом и длительным сроком носки.",
                stock_quantity: 15,
                status: "active",
                image: "../images/product1.jpg",
                created: "2024-01-10T10:00:00Z"
            },
            {
                id: 2,
                name: "Тушь для ресниц Веерный объём",
                brand: "Maybelline",
                price: 890,
                category_id: 1,
                description: "Тушь для создания объема и длины ресниц.",
                stock_quantity: 22,
                status: "active",
                image: "../images/product2.jpg",
                created: "2024-01-10T10:00:00Z"
            }
        ];

        const sampleUsers = [
            {
                id: 1,
                name: "Анна Петрова",
                email: "anna@mail.ru",
                phone: "+7 (999) 123-45-67",
                role: "user",
                orders_count: 3,
                status: "active",
                registered: "2024-01-10T09:00:00Z",
                address: "г. Москва"
            },
            {
                id: 2,
                name: "Иван Сидоров",
                email: "ivan@mail.ru",
                phone: "+7 (999) 234-56-78",
                role: "user",
                orders_count: 1,
                status: "active",
                registered: "2024-01-12T11:00:00Z",
                address: "г. Санкт-Петербург"
            }
        ];

        localStorage.setItem('admin_orders', JSON.stringify(sampleOrders));
        localStorage.setItem('admin_products', JSON.stringify(sampleProducts));
        localStorage.setItem('admin_users', JSON.stringify(sampleUsers));
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href').substring(1);
                this.showSection(target);
            });
        });

        window.addEventListener('hashchange', () => {
            this.showSectionFromHash();
        });
    }

    showSectionFromHash() {
        const hash = window.location.hash.substring(1) || 'orders';
        this.showSection(hash);
    }

    showSection(sectionId) {
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.remove('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        const targetSection = document.getElementById(sectionId);
        const targetLink = document.querySelector(`[href="#${sectionId}"]`);

        if (targetSection && targetLink) {
            targetSection.classList.add('active');
            targetLink.classList.add('active');
            this.loadSectionData(sectionId);
        }
    }

    loadSectionData(sectionId) {
        switch(sectionId) {
            case 'orders':
                this.loadOrdersData();
                break;
            case 'products':
                this.loadProductsData();
                break;
            case 'users':
                this.loadUsersData();
                break;
        }
    }

    setupEventListeners() {
        // Поиск
        document.getElementById('searchOrders')?.addEventListener('input', (e) => {
            this.searchTable('orders', e.target.value);
        });
        document.getElementById('searchProducts')?.addEventListener('input', (e) => {
            this.searchTable('products', e.target.value);
        });
        document.getElementById('searchUsers')?.addEventListener('input', (e) => {
            this.searchTable('users', e.target.value);
        });
        document.getElementById('searchCategories')?.addEventListener('input', (e) => {
            this.searchTable('categories', e.target.value);
        });

        // Фильтры
        document.getElementById('orderStatusFilter')?.addEventListener('change', (e) => {
            this.filterOrdersByStatus(e.target.value);
        });

        // Формы
        document.getElementById('productForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProduct();
        });
        document.getElementById('userForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveUser();
        });
        document.getElementById('categoryForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCategory();
        });

        // Загрузка изображений
        document.getElementById('imageUpload')?.addEventListener('change', (e) => {
            this.handleImageUpload(e.target.files[0]);
        });
    }

    // === ЗАКАЗЫ ===
    loadOrdersData() {
        const orders = this.getOrders();
        this.renderOrdersTable(orders);
        this.updatePagination('orders', orders.length);
    }

    getOrders() {
        return JSON.parse(localStorage.getItem('admin_orders') || '[]');
    }

    renderOrdersTable(orders) {
        const tbody = document.getElementById('ordersTable');
        if (!tbody) return;

        const startIndex = (this.currentPage.orders - 1) * this.itemsPerPage;
        const paginatedOrders = orders.slice(startIndex, startIndex + this.itemsPerPage);

        if (paginatedOrders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="loading-text">Заказы не найдены</td></tr>';
            return;
        }

        tbody.innerHTML = paginatedOrders.map(order => `
            <tr>
                <td><strong>#${order.id}</strong></td>
                <td>
                    <div class="user-info">
                        <strong>${order.user_name}</strong><br>
                        <small>${order.user_email}</small>
                    </div>
                </td>
                <td>
                    <small>${order.items.map(item => `${item.name} (${item.quantity} шт.)`).join(', ')}</small>
                </td>
                <td><strong>${order.total} руб.</strong></td>
                <td>
                    <select class="status-select" onchange="updateOrderStatus(${order.id}, this.value)" 
                            style="background: ${this.getStatusColor(order.status)}; color: white; border: none; padding: 0.3rem 0.5rem; border-radius: 4px;">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Ожидание</option>
                        <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Подтвержден</option>
                        <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Отправлен</option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Доставлен</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Отменен</option>
                    </select>
                </td>
                <td>${this.formatDate(order.created)}</td>
                <td>
                    <button class="btn btn-view" onclick="viewOrderDetails(${order.id})" title="Просмотр">👁️</button>
                    <button class="btn btn-edit" onclick="editOrder(${order.id})" title="Редактировать">✏️</button>
                    <button class="btn btn-delete" onclick="deleteOrder(${order.id})" title="Удалить">🗑️</button>
                </td>
            </tr>
        `).join('');
    }

    // === ТОВАРЫ ===
    loadProductsData() {
        const products = this.getProducts();
        this.renderProductsTable(products);
        this.updatePagination('products', products.length);
        this.loadCategoriesForSelect();
    }

    getProducts() {
        return JSON.parse(localStorage.getItem('admin_products') || '[]');
    }

    renderProductsTable(products) {
        const tbody = document.getElementById('productsTable');
        if (!tbody) return;

        const startIndex = (this.currentPage.products - 1) * this.itemsPerPage;
        const paginatedProducts = products.slice(startIndex, startIndex + this.itemsPerPage);

        if (paginatedProducts.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="loading-text">Товары не найдены</td></tr>';
            return;
        }

        tbody.innerHTML = paginatedProducts.map(product => `
            <tr>
                <td>${product.id}</td>
                <td>
                    <img src="${this.getProductImageUrl(product.image)}" alt="${product.name}" 
                         class="product-thumb" onerror="this.src='https://via.placeholder.com/50x50/FFE8E8/333?text=IMG'">
                </td>
                <td>${product.brand}</td>
                <td><strong>${product.price} руб.</strong></td>
                <td>${this.getCategoryName(product.category_id)}</td>
                <td>
                    <span class="${product.stock_quantity > 10 ? 'status-delivered' : product.stock_quantity > 0 ? 'status-pending' : 'status-cancelled'}">
                        ${product.stock_quantity} шт.
                    </span>
                </td>
                <td>
                    <span class="${product.status === 'active' ? 'status-active' : 'status-inactive'}">
                        ${product.status === 'active' ? 'Активен' : 'Неактивен'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-edit" onclick="editProduct(${product.id})" title="Редактировать">✏️</button>
                    <button class="btn btn-delete" onclick="deleteProduct(${product.id})" title="Удалить">🗑️</button>
                </td>
            </tr>
        `).join('');
    }

    // === ПОЛЬЗОВАТЕЛИ ===
    loadUsersData() {
        const users = this.getUsers();
        this.renderUsersTable(users);
        this.updatePagination('users', users.length);
    }

    getUsers() {
        return JSON.parse(localStorage.getItem('admin_users') || '[]');
    }

    renderUsersTable(users) {
        const tbody = document.getElementById('usersTable');
        if (!tbody) return;

        const startIndex = (this.currentPage.users - 1) * this.itemsPerPage;
        const paginatedUsers = users.slice(startIndex, startIndex + this.itemsPerPage);

        if (paginatedUsers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="loading-text">Пользователи не найдены</td></tr>';
            return;
        }

        tbody.innerHTML = paginatedUsers.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>
                    <strong>${user.name}</strong><br>
                    <small>${user.address}</small>
                </td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${this.formatDate(user.registered)}</td>
                <td><strong>${user.orders_count}</strong></td>
                <td>
                    <span class="${user.status === 'active' ? 'status-active' : 'status-inactive'}">
                        ${user.status === 'active' ? 'Активен' : 'Неактивен'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-view" onclick="viewUser(${user.id})" title="Просмотр">👁️</button>
                    <button class="btn btn-edit" onclick="editUser(${user.id})" title="Редактировать">✏️</button>
                </td>
            </tr>
        `).join('');
    }

    // === КАТЕГОРИИ ===
    loadCategoriesData() {
        const categories = this.getCategories();
        this.renderCategoriesTable(categories);
    }

    getCategories() {
        return JSON.parse(localStorage.getItem('admin_categories') || '[]');
    }

    renderCategoriesTable(categories) {
        const tbody = document.getElementById('categoriesTable');
        if (!tbody) return;

        if (categories.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="loading-text">Категории не найдены</td></tr>';
            return;
        }

        tbody.innerHTML = categories.map(category => `
            <tr>
                <td>${category.id}</td>
                <td><strong>${category.name}</strong></td>
                <td><code>${category.slug}</code></td>
                <td><strong>${category.product_count}</strong></td>
                <td>
                    <span class="${category.status === 'active' ? 'status-active' : 'status-inactive'}">
                        ${category.status === 'active' ? 'Активна' : 'Неактивна'}
                    </span>
                </td>
                <td>${this.formatDate(category.created)}</td>
                <td>
                    <button class="btn btn-edit" onclick="editCategory(${category.id})" title="Редактировать">✏️</button>
                    <button class="btn btn-delete" onclick="deleteCategory(${category.id})" title="Удалить">🗑️</button>
                </td>
            </tr>
        `).join('');
    }

    // === ПОИСК И ФИЛЬТРАЦИЯ ===
    searchTable(tableType, query) {
        let data = [];
        switch (tableType) {
            case 'orders': data = this.getOrders(); break;
            case 'products': data = this.getProducts(); break;
            case 'users': data = this.getUsers(); break;
            case 'categories': data = this.getCategories(); break;
        }

        const filteredData = data.filter(item => 
            JSON.stringify(item).toLowerCase().includes(query.toLowerCase())
        );

        this.renderFilteredTable(tableType, filteredData);
    }

    renderFilteredTable(tableType, data) {
        const tbody = document.getElementById(`${tableType}Table`);
        if (!tbody) return;

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10" class="loading-text">Ничего не найдено</td></tr>';
            return;
        }

        // Временно показываем все найденные результаты без пагинации
        switch (tableType) {
            case 'orders': this.renderOrdersTable(data); break;
            case 'products': this.renderProductsTable(data); break;
            case 'users': this.renderUsersTable(data); break;
        }
    }

    filterOrdersByStatus(status) {
        const orders = this.getOrders();
        const filteredOrders = status ? orders.filter(order => order.status === status) : orders;
        this.renderOrdersTable(filteredOrders);
    }

    // === ПАГИНАЦИЯ ===
    updatePagination(tableType, totalItems) {
        const pagination = document.getElementById(`${tableType}Pagination`);
        if (!pagination) return;

        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        const pageInfo = pagination.querySelector('.page-info');
        
        if (pageInfo) {
            pageInfo.textContent = `Страница ${this.currentPage[tableType]} из ${totalPages}`;
        }

        const prevBtn = pagination.querySelector('button:first-child');
        const nextBtn = pagination.querySelector('button:last-child');

        if (prevBtn) prevBtn.disabled = this.currentPage[tableType] <= 1;
        if (nextBtn) nextBtn.disabled = this.currentPage[tableType] >= totalPages;
    }

    changePage(tableType, direction) {
        const totalItems = {
            'orders': this.getOrders().length,
            'products': this.getProducts().length,
            'users': this.getUsers().length
        }[tableType];

        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        const newPage = this.currentPage[tableType] + direction;

        if (newPage >= 1 && newPage <= totalPages) {
            this.currentPage[tableType] = newPage;
            this.loadSectionData(tableType);
        }
    }

    // === ФОРМЫ ===
    showProductForm(product = null) {
        this.currentProduct = product;
        const modal = document.getElementById('productModal');
        const title = document.getElementById('productModalTitle');

        if (product) {
            title.textContent = 'Редактировать товар';
            this.fillProductForm(product);
        } else {
            title.textContent = 'Добавить товар';
            document.getElementById('productForm').reset();
            document.getElementById('imagePreview').innerHTML = '';
            this.uploadedImageName = null;
        }

        modal.style.display = 'block';
    }

    fillProductForm(product) {
        document.getElementById('productName').value = product.name;
        document.getElementById('productBrand').value = product.brand;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productCategory').value = product.category_id;
        document.getElementById('productDescription').value = product.description || '';
        document.getElementById('productStock').value = product.stock_quantity;

        if (product.image) {
            document.getElementById('imagePreview').innerHTML = `
                <div class="image-preview">
                    <img src="${this.getProductImageUrl(product.image)}" alt="${product.name}">
                    <button type="button" onclick="removeImagePreview()" class="btn btn-delete">×</button>
                </div>
            `;
        }
    }

    saveProduct() {
        const formData = new FormData(document.getElementById('productForm'));
        const productData = {
            id: this.currentProduct ? this.currentProduct.id : this.generateId('products'),
            name: formData.get('name'),
            brand: formData.get('brand'),
            price: parseFloat(formData.get('price')),
            category_id: parseInt(formData.get('category_id')),
            description: formData.get('description'),
            stock_quantity: parseInt(formData.get('stock_quantity')) || 0,
            status: 'active',
            image: this.uploadedImageName || this.currentProduct?.image || 'default.jpg',
            created: this.currentProduct ? this.currentProduct.created : new Date().toISOString()
        };

        const products = this.getProducts();
        
        if (this.currentProduct) {
            const index = products.findIndex(p => p.id === this.currentProduct.id);
            if (index !== -1) products[index] = productData;
        } else {
            products.push(productData);
        }

        localStorage.setItem('admin_products', JSON.stringify(products));
        this.showNotification('Товар успешно сохранен!', 'success');
        this.closeModal('productModal');
        this.loadProductsData();
    }

    // === ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ===
    getProductImageUrl(imageName) {
        if (!imageName) return 'https://via.placeholder.com/300x300/FFE8E8/333?text=Нет+изображения';
        
        const images = JSON.parse(localStorage.getItem('product_images') || '{}');
        return images[imageName] || `images/products/${imageName}`;
    }

    getStatusColor(status) {
        const colors = {
            'pending': '#ffc107',
            'confirmed': '#17a2b8',
            'shipped': '#6c757d',
            'delivered': '#28a745',
            'cancelled': '#dc3545'
        };
        return colors[status] || '#6c757d';
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU') + ' ' + date.toLocaleTimeString('ru-RU', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    generateId(tableType) {
        const data = this[`get${tableType.charAt(0).toUpperCase() + tableType.slice(1)}`]();
        return data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1;
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : '#dc3545'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 5px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }
}

// Глобальные функции
function showProductForm(product = null) {
    new AdminPanel().showProductForm(product);
}

function showUserForm(user = null) {
    // Реализация формы пользователя
    alert('Форма пользователя будет реализована');
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function removeImagePreview() {
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('imageUpload').value = '';
}

function updateOrderStatus(orderId, status) {
    const adminPanel = new AdminPanel();
    const orders = adminPanel.getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = status;
        localStorage.setItem('admin_orders', JSON.stringify(orders));
        adminPanel.showNotification(`Статус заказа #${orderId} изменен`, 'success');
        adminPanel.loadOrdersData();
    }
}

function viewOrderDetails(orderId) {
    const adminPanel = new AdminPanel();
    const orders = adminPanel.getOrders();
    const order = orders.find(o => o.id === orderId);
    
    if (order) {
        document.getElementById('orderDetailsId').textContent = orderId;
        document.getElementById('orderDetailsContent').innerHTML = `
            <div class="order-details">
                <div class="order-info">
                    <div>
                        <h4>Информация о клиенте</h4>
                        <p><strong>Имя:</strong> ${order.user_name}</p>
                        <p><strong>Email:</strong> ${order.user_email}</p>
                        <p><strong>Адрес:</strong> ${order.address}</p>
                    </div>
                    <div>
                        <h4>Информация о заказе</h4>
                        <p><strong>Статус:</strong> <span class="status-${order.status}">${order.status}</span></p>
                        <p><strong>Дата:</strong> ${adminPanel.formatDate(order.created)}</p>
                        <p><strong>Общая сумма:</strong> ${order.total} руб.</p>
                    </div>
                </div>
                
                <div class="order-items">
                    <h4>Состав заказа</h4>
                    ${order.items.map(item => `
                        <div class="order-item">
                            <span>${item.name} × ${item.quantity}</span>
                            <span>${item.price * item.quantity} руб.</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        document.getElementById('orderDetailsModal').style.display = 'block';
    }
}

function editProduct(productId) {
    const adminPanel = new AdminPanel();
    const products = adminPanel.getProducts();
    const product = products.find(p => p.id === productId);
    if (product) adminPanel.showProductForm(product);
}

function deleteProduct(productId) {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
        const adminPanel = new AdminPanel();
        const products = adminPanel.getProducts().filter(p => p.id !== productId);
        localStorage.setItem('admin_products', JSON.stringify(products));
        adminPanel.showNotification('Товар удален', 'success');
        adminPanel.loadProductsData();
    }
}

function editOrder(orderId) {
    alert(`Редактирование заказа #${orderId} будет реализовано`);
}

function deleteOrder(orderId) {
    if (confirm('Вы уверены, что хотите удалить этот заказ?')) {
        const adminPanel = new AdminPanel();
        const orders = adminPanel.getOrders().filter(o => o.id !== orderId);
        localStorage.setItem('admin_orders', JSON.stringify(orders));
        adminPanel.showNotification('Заказ удален', 'success');
        adminPanel.loadOrdersData();
    }
}

function viewUser(userId) {
    alert(`Просмотр пользователя #${userId} будет реализован`);
}

function editUser(userId) {
    alert(`Редактирование пользователя #${userId} будет реализовано`);
}

function sortTable(tableType, columnIndex) {
    alert(`Сортировка таблицы ${tableType} по колонке ${columnIndex} будет реализована`);
}

function changePage(tableType, direction) {
    new AdminPanel().changePage(tableType, direction);
}

function exportOrders() {
    const adminPanel = new AdminPanel();
    const orders = adminPanel.getOrders();
    const csvContent = "data:text/csv;charset=utf-8," 
        + "ID,Клиент,Email,Сумма,Статус,Дата\n"
        + orders.map(order => 
            `"${order.id}","${order.user_name}","${order.user_email}","${order.total}","${order.status}","${adminPanel.formatDate(order.created)}"`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "orders_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    adminPanel.showNotification('Экспорт заказов завершен', 'success');
}

// Закрытие модальных окон
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new AdminPanel();
});
