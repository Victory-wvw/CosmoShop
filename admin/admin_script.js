// Админ-панель CosmoShop
class AdminPanel {
    constructor() {
        this.currentProduct = null;
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupEventListeners();
        this.showSectionFromHash();
        console.log('👑 Админ-панель инициализирована');
    }

    setupNavigation() {
        // Обработка навигации
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href').substring(1);
                this.showSection(target);
            });
        });

        // Обработка изменения hash в URL
        window.addEventListener('hashchange', () => {
            this.showSectionFromHash();
        });
    }

    showSectionFromHash() {
        const hash = window.location.hash.substring(1) || 'dashboard';
        this.showSection(hash);
    }

    showSection(sectionId) {
        // Скрыть все секции
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.remove('active');
        });

        // Убрать активный класс у всех ссылок
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Показать выбранную секцию
        const targetSection = document.getElementById(sectionId);
        const targetLink = document.querySelector(`[href="#${sectionId}"]`);

        if (targetSection && targetLink) {
            targetSection.classList.add('active');
            targetLink.classList.add('active');
        }

        // Обновить данные секции при переходе
        this.loadSectionData(sectionId);
    }

    loadSectionData(sectionId) {
        switch(sectionId) {
            case 'dashboard':
                this.loadDashboardData();
                break;
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

    loadDashboardData() {
        console.log('Загрузка данных дашборда...');
        // Здесь будет загрузка реальных данных
    }

    loadOrdersData() {
        console.log('Загрузка данных заказов...');
        // Здесь будет загрузка реальных данных
    }

    loadProductsData() {
        console.log('Загрузка данных товаров...');
        // Здесь будет загрузка реальных данных
    }

    loadUsersData() {
        console.log('Загрузка данных пользователей...');
        // Здесь будет загрузка реальных данных
    }

    setupEventListeners() {
        // Обработка формы товара
        const productForm = document.getElementById('productForm');
        if (productForm) {
            productForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProduct();
            });
        }

        // Поиск заказов
        const searchOrders = document.getElementById('searchOrders');
        if (searchOrders) {
            searchOrders.addEventListener('input', (e) => {
                this.searchOrders(e.target.value);
            });
        }
    }

    searchOrders(query) {
        const rows = document.querySelectorAll('#ordersTable tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes(query.toLowerCase())) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
}

// Глобальные функции для вызова из HTML
function showProductForm(product = null) {
    const modal = document.getElementById('productModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('productForm');

    if (product) {
        title.textContent = 'Редактировать товар';
        // Заполнить форму данными товара
    } else {
        title.textContent = 'Добавить товар';
        form.reset();
    }

    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

function updateOrderStatus(orderId, status) {
    console.log(`Обновление статуса заказа ${orderId} на ${status}`);
    // Здесь будет API запрос для обновления статуса
    alert(`Статус заказа #${orderId} изменен на "${getStatusText(status)}"`);
}

function getStatusText(status) {
    const statuses = {
        'pending': 'Ожидание',
        'confirmed': 'Подтвержден',
        'shipped': 'Отправлен',
        'delivered': 'Доставлен'
    };
    return statuses[status] || status;
}

function viewOrder(orderId) {
    alert(`Просмотр заказа #${orderId}`);
    // Здесь будет открытие детальной страницы заказа
}

function editOrder(orderId) {
    alert(`Редактирование заказа #${orderId}`);
    // Здесь будет открытие формы редактирования заказа
}

function editProduct(productId) {
    alert(`Редактирование товара #${productId}`);
    // Здесь будет открытие формы редактирования товара
}

function deleteProduct(productId) {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
        console.log(`Удаление товара #${productId}`);
        // Здесь будет API запрос для удаления товара
        alert('Товар удален');
    }
}

function viewUser(userId) {
    alert(`Просмотр пользователя #${userId}`);
}

function editUser(userId) {
    alert(`Редактирование пользователя #${userId}`);
}

// Закрытие модального окна при клике вне его
window.addEventListener('click', (e) => {
    const modal = document.getElementById('productModal');
    if (e.target === modal) {
        closeModal();
    }
});

// Инициализация админ-панели при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new AdminPanel();
});
