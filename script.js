// Global Variables
let inventory = [];
let sales = [];
let customers = [];
let activities = [];

// Global error handler
window.addEventListener('error', function(e) {
    // Suppress source map errors
    if (e.message.includes('source map') || e.message.includes('.map')) {
        e.preventDefault();
        return false;
    }
});

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    try {
        loadData();
        initializeDashboard();
        setupEventListeners();
        updateMetrics();
        loadRecentActivity();
        initializeInteractiveFeatures();
        setupAnimations();
        
        // Initialize inventory page specifically
        if (window.location.pathname.includes('inventory.html') || window.location.pathname.includes('inventory')) {
            initializeInventoryPage();
        }
    } catch (error) {
        console.warn('Error during application initialization:', error);
        // Show user-friendly error message
        showToast('Application loaded with some features disabled', 'warning');
    }
});

// Setup animations
function setupAnimations() {
    // Add entrance animations to elements
    const animatedElements = document.querySelectorAll('.metric-card, .chart-container, .recent-activity, .quick-actions');
    animatedElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
        el.classList.add('fadeInUp');
    });
}

// Data Management
function loadData() {
    inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    sales = JSON.parse(localStorage.getItem('sales')) || [];
    customers = JSON.parse(localStorage.getItem('customers')) || [];
    activities = JSON.parse(localStorage.getItem('activities')) || [];
    
    // Initialize with sample data if inventory is empty
    if (inventory.length === 0) {
        initializeSampleData();
    }
}

// Initialize sample data for demonstration
function initializeSampleData() {
    console.log('Initializing sample data...');
    
    const sampleProducts = [
        {
            id: generateId(),
            name: "Laptop Dell XPS 13",
            price: 89999.00,
            stock: 15,
            category: "Electronics",
            supplier: "Dell India",
            description: "13-inch premium laptop with Intel i7 processor",
            sku: "SKU" + Math.random().toString(36).substr(2, 8).toUpperCase(),
            createdAt: new Date().toISOString(),
            status: "active"
        },
        {
            id: generateId(),
            name: "Wireless Bluetooth Headphones",
            price: 2499.00,
            stock: 8,
            category: "Electronics",
            supplier: "AudioTech Solutions",
            description: "Noise cancelling wireless headphones",
            sku: "SKU" + Math.random().toString(36).substr(2, 8).toUpperCase(),
            createdAt: new Date().toISOString(),
            status: "active"
        },
        {
            id: generateId(),
            name: "Cotton T-Shirt",
            price: 599.00,
            stock: 45,
            category: "Clothing",
            supplier: "Fashion Hub",
            description: "Comfortable cotton t-shirt in various colors",
            sku: "SKU" + Math.random().toString(36).substr(2, 8).toUpperCase(),
            createdAt: new Date().toISOString(),
            status: "active"
        },
        {
            id: generateId(),
            name: "Programming Book - JavaScript",
            price: 799.00,
            stock: 3,
            category: "Books",
            supplier: "Tech Books Ltd",
            description: "Complete guide to JavaScript programming",
            sku: "SKU" + Math.random().toString(36).substr(2, 8).toUpperCase(),
            createdAt: new Date().toISOString(),
            status: "active"
        },
        {
            id: generateId(),
            name: "Garden Tool Set",
            price: 1299.00,
            stock: 12,
            category: "Home & Garden",
            supplier: "Green Thumb Tools",
            description: "Complete set of essential garden tools",
            sku: "SKU" + Math.random().toString(36).substr(2, 8).toUpperCase(),
            createdAt: new Date().toISOString(),
            status: "active"
        }
    ];
    
    inventory.push(...sampleProducts);
    
    // Add sample activities
    sampleProducts.forEach(product => {
        addActivity('inventory', `Sample product added: ${product.name}`, 'System initialization');
    });
    
    // Save to localStorage
    saveData();
    
    console.log('Sample data initialized:', inventory);
    showToast('Sample inventory data loaded!', 'info');
}

function saveData() {
    localStorage.setItem('inventory', JSON.stringify(inventory));
    localStorage.setItem('sales', JSON.stringify(sales));
    localStorage.setItem('customers', JSON.stringify(customers));
    localStorage.setItem('activities', JSON.stringify(activities));
}

// Dashboard Initialization
function initializeDashboard() {
    // Wait for Chart.js to be available
    if (typeof Chart === 'undefined') {
        // Try to load Chart.js dynamically if it failed
        loadChartJSFallback().then(() => {
            if (document.getElementById('salesChart')) {
                initializeSalesChart();
            }
            if (document.getElementById('productsChart')) {
                initializeProductsChart();
            }
        }).catch(() => {
            console.warn('Chart.js failed to load, showing fallback content');
            showChartFallbacks();
        });
    } else {
        if (document.getElementById('salesChart')) {
            initializeSalesChart();
        }
        if (document.getElementById('productsChart')) {
            initializeProductsChart();
        }
    }
}

// Fallback Chart.js loader
function loadChartJSFallback() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Show fallback content when charts fail
function showChartFallbacks() {
    const salesChart = document.getElementById('salesChart');
    const productsChart = document.getElementById('productsChart');
    
    if (salesChart) {
        salesChart.style.display = 'none';
        const fallback = document.createElement('div');
        fallback.className = 'chart-fallback';
        fallback.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #666;">
                <i class="fas fa-chart-line" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <h4>Sales Chart</h4>
                <p>Chart temporarily unavailable</p>
                <button onclick="location.reload()" class="btn btn-primary">Retry</button>
            </div>
        `;
        salesChart.parentElement.appendChild(fallback);
    }
    
    if (productsChart) {
        productsChart.style.display = 'none';
        const fallback = document.createElement('div');
        fallback.className = 'chart-fallback';
        fallback.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #666;">
                <i class="fas fa-chart-pie" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <h4>Products Chart</h4>
                <p>Chart temporarily unavailable</p>
                <button onclick="location.reload()" class="btn btn-primary">Retry</button>
            </div>
        `;
        productsChart.parentElement.appendChild(fallback);
    }
}

// Event Listeners Setup
function setupEventListeners() {
    // Product Form
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', handleAddProduct);
    }

    // Sales Form
    const salesForm = document.getElementById('salesForm');
    if (salesForm) {
        salesForm.addEventListener('submit', handleRecordSale);
    }

    // Search Functionality
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Sales Period Selector
    const salesPeriod = document.getElementById('salesPeriod');
    if (salesPeriod) {
        salesPeriod.addEventListener('change', updateSalesChart);
    }

    // Sales form interactions
    const saleProduct = document.getElementById('saleProduct');
    if (saleProduct) {
        saleProduct.addEventListener('change', handleProductSelection);
    }

    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        quantityInput.addEventListener('input', updateTotalPrice);
    }

    // Inventory filter
    const inventoryFilter = document.getElementById('inventoryFilter');
    if (inventoryFilter) {
        inventoryFilter.addEventListener('input', handleInventorySearch);
    }

    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', handleCategoryFilter);
    }

    // Sales filter
    const salesFilter = document.getElementById('salesFilter');
    if (salesFilter) {
        salesFilter.addEventListener('input', handleSalesSearch);
    }

    const dateFilter = document.getElementById('dateFilter');
    if (dateFilter) {
        dateFilter.addEventListener('change', handleDateFilter);
    }

    // Interactive Elements
    setupInteractiveElements();
    setupDragAndDrop();
    setupKeyboardShortcuts();
    setupRealTimeUpdates();
}

// Product Management
function handleAddProduct(e) {
    e.preventDefault();
    
    console.log('Adding new product...');
    
    const formData = new FormData(e.target);
    const product = {
        id: generateId(),
        name: formData.get('name') || document.getElementById('name').value,
        price: parseFloat(formData.get('price') || document.getElementById('price').value),
        stock: parseInt(formData.get('stock') || document.getElementById('stock').value),
        category: formData.get('category') || 'General',
        supplier: formData.get('supplier') || 'Unknown',
        description: formData.get('description') || '',
        sku: generateSKU(),
        createdAt: new Date().toISOString(),
        status: 'active'
    };

    console.log('Product data:', product);

    // Validate product data
    if (!product.name || product.price <= 0 || product.stock < 0) {
        showToast('Please fill in all required fields correctly!', 'error');
        return;
    }

    inventory.push(product);
    saveData();
    
    // Add activity
    addActivity('inventory', `Added new product: ${product.name}`, 'Product added to inventory');
    
    // Update display
    displayInventory();
    updateMetrics();
    updateInventoryMetrics();
    
    // Show success message
    showToast('Product added successfully!', 'success');
    
    // Reset form and hide it
    e.target.reset();
    hideAddProductForm();
    
    // Auto-generate new SKU for next product
    const skuInput = document.getElementById('sku');
    if (skuInput) {
        skuInput.value = generateSKU();
    }
}

function displayInventory() {
    const table = document.querySelector("#inventoryTable tbody");
    if (!table) {
        console.warn('Inventory table not found');
        return;
    }
    
    console.log('Displaying inventory:', inventory);
    
    table.innerHTML = "";
    
    if (inventory.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                <i class="fas fa-box-open" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>No products in inventory yet.</p>
                <p>Click "Add Product" to get started!</p>
            </td>
        `;
        table.appendChild(emptyRow);
        return;
    }
    
    inventory.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="product-info">
                    <strong>${item.name}</strong>
                    <small>SKU: ${item.sku}</small>
                    ${item.description ? `<br><small style="color: var(--text-muted);">${item.description}</small>` : ''}
                </div>
            </td>
            <td>₹${item.price.toFixed(2)}</td>
            <td>
                <span class="stock-amount ${item.stock < 10 ? 'low-stock' : ''}">${item.stock}</span>
            </td>
            <td>${item.category}</td>
            <td>${item.supplier}</td>
            <td>
                <span class="status-badge ${item.status}">${item.status}</span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-secondary btn-sm" onclick="editProduct('${item.id}')" title="Edit Product">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct('${item.id}')" title="Delete Product">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        table.appendChild(row);
    });
}

// Sales Management
function handleRecordSale(e) {
    e.preventDefault();
    
    const productName = document.getElementById('saleProduct').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const customerName = document.getElementById('customerName')?.value || 'Walk-in Customer';
    
    // Find product in inventory
    const product = inventory.find(item => item.name.toLowerCase().includes(productName.toLowerCase()));
    
    if (!product) {
        showToast('Product not found in inventory!', 'error');
        return;
    }
    
    if (product.stock < quantity) {
        showToast('Insufficient stock!', 'error');
        return;
    }
    
    // Create sale record
    const sale = {
        id: generateId(),
        productId: product.id,
        productName: product.name,
        quantity: quantity,
        unitPrice: product.price,
        totalPrice: product.price * quantity,
        customerName: customerName,
        date: new Date().toISOString(),
        paymentMethod: 'Cash',
        status: 'completed'
    };
    
    // Update inventory
    product.stock -= quantity;
    
    // Add to sales
    sales.push(sale);
    
    // Save data
    saveData();
    
    // Add activity
            addActivity('sale', `Sale recorded: ${quantity}x ${product.name}`, `Revenue: ₹${sale.totalPrice.toFixed(2)}`);
    
    // Update displays
    displayInventory();
    displaySales();
    updateMetrics();
    
    // Show success message
    showToast('Sale recorded successfully!', 'success');
    
    // Reset form
    e.target.reset();
}

function displaySales() {
    const salesList = document.getElementById('salesList');
    if (!salesList) return;
    
    salesList.innerHTML = "";
    
    sales.slice(-10).reverse().forEach(sale => {
        const li = document.createElement('li');
        li.className = 'sale-item';
        li.innerHTML = `
            <div class="sale-info">
                <strong>${sale.productName}</strong>
                <span>${sale.quantity}x @ ₹${sale.unitPrice}</span>
                <span class="sale-total">₹${sale.totalPrice.toFixed(2)}</span>
            </div>
            <div class="sale-meta">
                <small>${sale.customerName}</small>
                <small>${formatDate(sale.date)}</small>
            </div>
        `;
        salesList.appendChild(li);
    });
}

// Customer Management
function addCustomer(customerData) {
    const customer = {
        id: generateId(),
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address,
        createdAt: new Date().toISOString(),
        status: 'active',
        totalSpent: 0,
        orders: 0
    };
    
    customers.push(customer);
    saveData();
    
    addActivity('customer', `New customer added: ${customer.name}`, 'Customer profile created');
    showToast('Customer added successfully!', 'success');
}

// Metrics and Analytics
function updateMetrics() {
    const totalProducts = document.getElementById('totalProducts');
    const totalRevenue = document.getElementById('totalRevenue');
    const totalSales = document.getElementById('totalSales');
    const lowStockItems = document.getElementById('lowStockItems');
    
    if (totalProducts) {
        totalProducts.textContent = inventory.length;
    }
    
    if (totalRevenue) {
        const revenue = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
        totalRevenue.textContent = `₹${revenue.toFixed(2)}`;
    }
    
    if (totalSales) {
        totalSales.textContent = sales.length;
    }
    
    if (lowStockItems) {
        const lowStock = inventory.filter(item => item.stock < 10).length;
        lowStockItems.textContent = lowStock;
    }
}

// Charts
function initializeSalesChart() {
    try {
        const ctx = document.getElementById('salesChart');
        if (!ctx) return;
        
        // Check if Chart is available
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js not loaded, skipping chart initialization');
            return;
        }
        
        const salesData = getSalesData(30);
        
        // Store chart instance globally for updates
        window.salesChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: salesData.labels,
                datasets: [{
                    label: 'Daily Sales',
                    data: salesData.values,
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                layout: {
                    padding: {
                        top: 10,
                        bottom: 10
                    }
                }
            }
        });
    } catch (error) {
        console.warn('Error initializing sales chart:', error);
        // Fallback: show a message instead of chart
        const ctx = document.getElementById('salesChart');
        if (ctx) {
            ctx.style.display = 'none';
            const fallback = document.createElement('div');
            fallback.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Chart unavailable</p>';
            ctx.parentElement.appendChild(fallback);
        }
    }
}

function initializeProductsChart() {
    try {
        const ctx = document.getElementById('productsChart');
        if (!ctx) return;
        
        // Check if Chart is available
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js not loaded, skipping chart initialization');
            return;
        }
        
        const topProducts = getTopProducts();
        
        // Store chart instance globally for updates
        window.productsChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: topProducts.labels,
                datasets: [{
                    data: topProducts.values,
                    backgroundColor: [
                        '#2563eb',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444',
                        '#8b5cf6'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 10,
                            usePointStyle: true
                        }
                    }
                },
                layout: {
                    padding: {
                        top: 10,
                        bottom: 10
                    }
                }
            }
        });
    } catch (error) {
        console.warn('Error initializing products chart:', error);
        // Fallback: show a message instead of chart
        const ctx = document.getElementById('productsChart');
        if (ctx) {
            ctx.style.display = 'none';
            const fallback = document.createElement('div');
            fallback.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Chart unavailable</p>';
            ctx.parentElement.appendChild(fallback);
        }
    }
}

function updateSalesChart() {
    try {
        const period = document.getElementById('salesPeriod')?.value || 30;
        const salesData = getSalesData(parseInt(period));
        
        // Update chart data if chart exists
        if (window.salesChart && window.salesChart.update) {
            window.salesChart.data.labels = salesData.labels;
            window.salesChart.data.datasets[0].data = salesData.values;
            window.salesChart.update('none'); // Use 'none' for better performance
        }
    } catch (error) {
        console.warn('Error updating sales chart:', error);
    }
}

// Data Processing
function getSalesData(days) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const labels = [];
    const values = [];
    
    for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        const daySales = sales.filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate.toDateString() === date.toDateString();
        });
        
        const total = daySales.reduce((sum, sale) => sum + sale.totalPrice, 0);
        
        labels.push(dateStr);
        values.push(total);
    }
    
    return { labels, values };
}

function getTopProducts() {
    const productSales = {};
    
    sales.forEach(sale => {
        if (productSales[sale.productName]) {
            productSales[sale.productName] += sale.quantity;
        } else {
            productSales[sale.productName] = sale.quantity;
        }
    });
    
    const sorted = Object.entries(productSales)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);
    
    return {
        labels: sorted.map(([name]) => name),
        values: sorted.map(([,quantity]) => quantity)
    };
}

// Activity Management
function addActivity(type, title, description) {
    const activity = {
        id: generateId(),
        type: type,
        title: title,
        description: description,
        timestamp: new Date().toISOString()
    };
    
    activities.unshift(activity);
    
    // Keep only last 50 activities
    if (activities.length > 50) {
        activities = activities.slice(0, 50);
    }
    
    saveData();
    loadRecentActivity();
}

function loadRecentActivity() {
    const activityList = document.getElementById('recentActivityList');
    if (!activityList) return;
    
    activityList.innerHTML = "";
    
    activities.slice(0, 10).forEach(activity => {
        const item = document.createElement('div');
        item.className = 'activity-item';
        
        const iconClass = getActivityIconClass(activity.type);
        
        item.innerHTML = `
            <div class="activity-icon ${activity.type}">
                <i class="fas ${iconClass}"></i>
            </div>
            <div class="activity-content">
                <h4>${activity.title}</h4>
                <p>${activity.description}</p>
            </div>
            <div class="activity-time">
                ${formatTimeAgo(activity.timestamp)}
            </div>
        `;
        
        activityList.appendChild(item);
    });
}

function getActivityIconClass(type) {
    switch (type) {
        case 'sale': return 'fa-shopping-cart';
        case 'inventory': return 'fa-boxes';
        case 'customer': return 'fa-user-plus';
        case 'alert': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

// Utility Functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function generateSKU() {
    return 'SKU' + Math.random().toString(36).substr(2, 8).toUpperCase();
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatTimeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

// Search Functionality
function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    
    // Search in inventory
    const inventoryRows = document.querySelectorAll('#inventoryTable tbody tr');
    inventoryRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
    });
    
    // Search in sales
    const salesItems = document.querySelectorAll('#salesList li');
    salesItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? '' : 'none';
    });
}

// Toast Notifications
function showToast(message, type = 'info') {
    const toastContainer = document.querySelector('.toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

// Export Functionality
function exportData() {
    const data = {
        inventory,
        sales,
        customers,
        activities,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-sales-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Data exported successfully!', 'success');
}

// Product Management Functions
function editProduct(productId) {
    const product = inventory.find(item => item.id === productId);
    if (!product) {
        showToast('Product not found!', 'error');
        return;
    }
    
    // Create edit form
    const form = document.createElement('div');
    form.className = 'edit-form-overlay';
    form.innerHTML = `
        <div class="edit-form">
            <div class="form-header">
                <h3><i class="fas fa-edit"></i> Edit Product</h3>
                <button class="btn btn-secondary" onclick="closeEditForm()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form id="editProductForm">
                <div class="form-row">
                    <div class="form-group">
                        <label>Name *</label>
                        <input type="text" class="form-control" name="name" value="${product.name}" required>
                    </div>
                    <div class="form-group">
                        <label>SKU</label>
                        <input type="text" class="form-control" name="sku" value="${product.sku}" readonly>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Price (₹) *</label>
                        <input type="number" class="form-control" name="price" value="${product.price}" step="0.01" min="0" required>
                    </div>
                    <div class="form-group">
                        <label>Stock *</label>
                        <input type="number" class="form-control" name="stock" value="${product.stock}" min="0" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Category</label>
                        <select class="form-control" name="category">
                            <option value="Electronics" ${product.category === 'Electronics' ? 'selected' : ''}>Electronics</option>
                            <option value="Clothing" ${product.category === 'Clothing' ? 'selected' : ''}>Clothing</option>
                            <option value="Books" ${product.category === 'Books' ? 'selected' : ''}>Books</option>
                            <option value="Home & Garden" ${product.category === 'Home & Garden' ? 'selected' : ''}>Home & Garden</option>
                            <option value="Sports" ${product.category === 'Sports' ? 'selected' : ''}>Sports</option>
                            <option value="Automotive" ${product.category === 'Automotive' ? 'selected' : ''}>Automotive</option>
                            <option value="Health & Beauty" ${product.category === 'Health & Beauty' ? 'selected' : ''}>Health & Beauty</option>
                            <option value="Other" ${product.category === 'Other' ? 'selected' : ''}>Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Supplier</label>
                        <input type="text" class="form-control" name="supplier" value="${product.supplier}">
                    </div>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea class="form-control" name="description" rows="3">${product.description || ''}</textarea>
                </div>
                <div class="form-buttons">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i>
                        Save Changes
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="closeEditForm()">
                        <i class="fas fa-times"></i>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(form);
    
    // Handle form submission
    document.getElementById('editProductForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        // Update product
        product.name = formData.get('name');
        product.price = parseFloat(formData.get('price'));
        product.stock = parseInt(formData.get('stock'));
        product.category = formData.get('category');
        product.supplier = formData.get('supplier');
        product.description = formData.get('description');
        product.updatedAt = new Date().toISOString();
        
        saveData();
        
        // Add activity
        addActivity('inventory', `Updated product: ${product.name}`, 'Product information modified');
        
        // Update displays
        displayInventory();
        updateMetrics();
        updateInventoryMetrics();
        
        closeEditForm();
        showToast('Product updated successfully!', 'success');
    });
}

function closeEditForm() {
    const overlay = document.querySelector('.edit-form-overlay');
    if (overlay) {
        overlay.remove();
    }
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
        const productIndex = inventory.findIndex(item => item.id === productId);
        if (productIndex !== -1) {
            const deletedProduct = inventory[productIndex];
            inventory.splice(productIndex, 1);
            saveData();
            
            // Add activity
            addActivity('inventory', `Deleted product: ${deletedProduct.name}`, 'Product removed from inventory');
            
            // Update displays
            displayInventory();
            updateMetrics();
            updateInventoryMetrics();
            
            showToast('Product deleted successfully!', 'success');
        }
    }
}

// Initialize displays if on relevant pages
if (document.getElementById('inventoryTable')) {
    displayInventory();
}

if (document.getElementById('salesList')) {
    displaySales();
}

// ===== INVENTORY & SALES FUNCTIONS =====

// Show/Hide Add Product Form
function showAddProductModal() {
    const form = document.getElementById('addProductForm');
    if (form) {
        form.style.display = 'block';
        // Auto-generate SKU
        const skuInput = document.getElementById('sku');
        if (skuInput) {
            skuInput.value = generateSKU();
        }
        // Focus on first input
        const nameInput = document.getElementById('name');
        if (nameInput) nameInput.focus();
        
        console.log('Add product form shown');
    }
}

function hideAddProductForm() {
    const form = document.getElementById('addProductForm');
    if (form) {
        form.style.display = 'none';
        // Reset form
        const productForm = document.getElementById('productForm');
        if (productForm) {
            productForm.reset();
        }
        console.log('Add product form hidden');
    }
}

// Show/Hide Add Sale Form
function showAddSaleModal() {
    const form = document.getElementById('addSaleForm');
    if (form) {
        form.style.display = 'block';
        // Populate product dropdown
        populateProductDropdown();
        // Focus on first input
        const productSelect = document.getElementById('saleProduct');
        if (productSelect) productSelect.focus();
    }
}

function hideAddSaleForm() {
    const form = document.getElementById('addSaleForm');
    if (form) {
        form.style.display = 'none';
        // Reset form
        document.getElementById('salesForm').reset();
    }
}

// Populate product dropdown for sales
function populateProductDropdown() {
    const select = document.getElementById('saleProduct');
    if (!select) return;
    
    // Clear existing options
    select.innerHTML = '<option value="">Select a product</option>';
    
    // Add products from inventory
    inventory.forEach(product => {
        if (product.stock > 0) {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = `${product.name} (Stock: ${product.stock})`;
            option.dataset.price = product.price;
            select.appendChild(option);
        }
    });
}

// Handle product selection in sales form
function handleProductSelection() {
    const productSelect = document.getElementById('saleProduct');
    const unitPriceInput = document.getElementById('unitPrice');
    const totalPriceInput = document.getElementById('totalPrice');
    const quantityInput = document.getElementById('quantity');
    
    if (!productSelect || !unitPriceInput || !totalPriceInput || !quantityInput) return;
    
    const selectedOption = productSelect.options[productSelect.selectedIndex];
    if (selectedOption.value) {
        const price = parseFloat(selectedOption.dataset.price);
        unitPriceInput.value = price.toFixed(2);
        updateTotalPrice();
    } else {
        unitPriceInput.value = '';
        totalPriceInput.value = '';
    }
}

// Update total price in sales form
function updateTotalPrice() {
    const unitPriceInput = document.getElementById('unitPrice');
    const quantityInput = document.getElementById('quantity');
    const totalPriceInput = document.getElementById('totalPrice');
    
    if (!unitPriceInput || !quantityInput || !totalPriceInput) return;
    
    const unitPrice = parseFloat(unitPriceInput.value) || 0;
    const quantity = parseInt(quantityInput.value) || 0;
    const totalPrice = unitPrice * quantity;
    
    totalPriceInput.value = totalPrice.toFixed(2);
}

// Filter functions
// Enhanced inventory search and filtering
function handleInventorySearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#inventoryTable tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const shouldShow = text.includes(searchTerm);
        row.style.display = shouldShow ? '' : 'none';
        
        // Add highlight effect for search terms
        if (searchTerm && shouldShow) {
            highlightSearchTerm(row, searchTerm);
        } else {
            removeHighlight(row);
        }
    });
}

function highlightSearchTerm(row, searchTerm) {
    const cells = row.querySelectorAll('td');
    cells.forEach(cell => {
        const text = cell.textContent;
        if (text.toLowerCase().includes(searchTerm)) {
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            cell.innerHTML = text.replace(regex, '<mark style="background: var(--warning-lighter); padding: 0.1rem 0.2rem; border-radius: 0.2rem;">$1</mark>');
        }
    });
}

function removeHighlight(row) {
    const cells = row.querySelectorAll('td');
    cells.forEach(cell => {
        const text = cell.textContent;
        // Remove mark tags but keep the text
        if (cell.innerHTML.includes('<mark>')) {
            cell.innerHTML = text;
        }
    });
}

// Enhanced category filtering
function handleCategoryFilter(e) {
    const category = e.target.value;
    const rows = document.querySelectorAll('#inventoryTable tbody tr');
    
    rows.forEach(row => {
        if (!category || category === '') {
            row.style.display = '';
        } else {
            const categoryCell = row.querySelector('td:nth-child(4)');
            if (categoryCell && categoryCell.textContent === category) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    });
    
    // Update metrics for filtered view
    updateFilteredMetrics(category);
}

function updateFilteredMetrics(category) {
    const filteredInventory = category ? inventory.filter(item => item.category === category) : inventory;
    
    const totalProductsCount = document.getElementById('totalProductsCount');
    const lowStockCount = document.getElementById('lowStockCount');
    const totalInventoryValue = document.getElementById('totalInventoryValue');
    
    if (totalProductsCount) {
        totalProductsCount.textContent = filteredInventory.length;
    }
    
    if (lowStockCount) {
        const lowStock = filteredInventory.filter(item => item.stock < 10).length;
        lowStockCount.textContent = lowStock;
    }
    
    if (totalInventoryValue) {
        const totalValue = filteredInventory.reduce((sum, item) => sum + (item.price * item.stock), 0);
        totalInventoryValue.textContent = `₹${totalValue.toFixed(2)}`;
    }
}

function handleSalesSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const salesItems = document.querySelectorAll('#salesList .sale-item');
    
    salesItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function handleDateFilter(e) {
    const filter = e.target.value;
    const salesItems = document.querySelectorAll('#salesList .sale-item');
    const today = new Date();
    
    salesItems.forEach(item => {
        const dateText = item.querySelector('.sale-meta small')?.textContent;
        if (!dateText) return;
        
        const saleDate = new Date(dateText);
        let show = true;
        
        switch(filter) {
            case 'today':
                show = saleDate.toDateString() === today.toDateString();
                break;
            case 'week':
                const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                show = saleDate >= weekAgo;
                break;
            case 'month':
                const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                show = saleDate >= monthAgo;
                break;
            default:
                show = true;
        }
        
        item.style.display = show ? '' : 'none';
    });
}

// Export functions
function exportInventory() {
    try {
        const data = {
            inventory: inventory,
            exportDate: new Date().toISOString(),
            totalProducts: inventory.length,
            totalValue: inventory.reduce((sum, item) => sum + (item.price * item.stock), 0),
            categories: [...new Set(inventory.map(item => item.category))],
            suppliers: [...new Set(inventory.map(item => item.supplier))]
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `inventory-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('Inventory exported successfully!', 'success');
        
        // Add activity
        addActivity('inventory', 'Inventory exported', `Exported ${inventory.length} products`);
        
    } catch (error) {
        console.error('Export failed:', error);
        showToast('Export failed. Please try again.', 'error');
    }
}

function exportSales() {
    const data = {
        sales: sales,
        exportDate: new Date().toISOString(),
        totalSales: sales.length,
        totalRevenue: sales.reduce((sum, sale) => sum + sale.totalPrice, 0)
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('Sales exported successfully!', 'success');
}

// Add CSS for edit form and chart fallbacks
const style = document.createElement('style');
style.textContent = `
    .edit-form-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    }
    
    .edit-form {
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
        max-width: 500px;
        width: 90%;
    }
    
    .edit-form h3 {
        margin-bottom: 1.5rem;
        color: var(--text-primary);
    }
    
    .form-buttons {
        display: flex;
        gap: 1rem;
        margin-top: 1.5rem;
    }
    
    .btn-sm {
        padding: 0.5rem 1rem;
        font-size: 0.75rem;
    }
    
    .product-info {
        display: flex;
        flex-direction: column;
    }
    
    .product-info small {
        color: var(--text-secondary);
        font-size: 0.75rem;
    }
    
    .stock-amount.low-stock {
        color: var(--danger-color);
        font-weight: 600;
    }
    
    .sale-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: var(--light-bg);
        border-radius: 0.5rem;
        margin-bottom: 0.5rem;
    }
    
    .sale-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
    
    .sale-total {
        font-weight: 600;
        color: var(--success-color);
    }
    
    .sale-meta {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0.25rem;
    }
    
    .sale-meta small {
        color: var(--text-secondary);
    }
    
    .chart-fallback {
        background: var(--neutral-50);
        border: 2px dashed var(--border-color);
        border-radius: 0.5rem;
        margin: 1rem 0;
    }
    
    .chart-fallback button {
        margin-top: 1rem;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .metric-card.clicked {
        transform: scale(0.98);
        transition: transform 0.1s ease;
    }
    
    .metric-card.dragging {
        opacity: 0.5;
        transform: rotate(5deg);
    }
    
    .chart-container.drag-over {
        border-color: var(--primary-color);
        background: var(--neutral-50);
    }
    
    .data-table tbody tr.selected {
        background: var(--primary-lighter) !important;
        border-left: 4px solid var(--primary-color);
    }
    
    .form-group.focused label {
        color: var(--primary-color);
        font-weight: 600;
    }
    
    .form-control.valid {
        border-color: var(--success-color);
        box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
    }
    
    .form-control.invalid {
        border-color: var(--danger-color);
        box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    }
    
    .interactive-notification {
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 1rem;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    }
    
    .notification-content {
        padding: 1.5rem;
    }
    
    .notification-content h4 {
        color: var(--text-primary);
        margin-bottom: 1rem;
    }
    
    .notification-content ul {
        margin: 1rem 0;
        padding-left: 1.5rem;
    }
    
    .notification-content li {
        margin-bottom: 0.5rem;
        color: var(--text-secondary);
    }
    
    .notification-content button {
        background: var(--gradient-primary);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        cursor: pointer;
        font-weight: 500;
        transition: var(--transition);
    }
    
    .notification-content button:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }
`;
document.head.appendChild(style);

// ===== INTERACTIVE FEATURES =====

// Initialize Interactive Features
function initializeInteractiveFeatures() {
    setupMetricCardInteractions();
    setupChartInteractions();
    setupTableInteractions();
    setupFormEnhancements();
}

// Setup Interactive Elements
function setupInteractiveElements() {
    // Metric Cards
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.add('clicked');
            setTimeout(() => card.classList.remove('clicked'), 200);
            showMetricDetails(card);
        });
    });

    // Action Buttons
    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            createRippleEffect(e);
            addButtonAnimation(btn);
        });
    });

    // Search Bar
    const searchBar = document.querySelector('.search-bar input');
    if (searchBar) {
        searchBar.addEventListener('focus', () => {
            searchBar.parentElement.classList.add('focused');
        });
        searchBar.addEventListener('blur', () => {
            searchBar.parentElement.classList.remove('focused');
        });
    }
}

// Setup Drag and Drop
function setupDragAndDrop() {
    // Make metric cards draggable
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
        card.setAttribute('draggable', 'true');
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
    });

    // Setup drop zones
    const dropZones = document.querySelectorAll('.chart-container, .recent-activity');
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('drop', handleDrop);
    });
}

// Drag and Drop Handlers
function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    const draggedElement = document.getElementById(draggedId);
    
    if (draggedElement && e.currentTarget.classList.contains('chart-container')) {
        // Add metric to chart
        addMetricToChart(draggedElement);
    }
    
    e.currentTarget.classList.remove('drag-over');
}

// Setup Keyboard Shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('.search-bar input');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Ctrl/Cmd + N for new product
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            if (window.location.pathname.includes('inventory')) {
                document.getElementById('addProductBtn')?.click();
            }
        }
        
        // Ctrl/Cmd + S for new sale
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            if (window.location.pathname.includes('sales')) {
                document.getElementById('newSaleBtn')?.click();
            }
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// Setup Real-time Updates
function setupRealTimeUpdates() {
    // Update metrics every 30 seconds
    setInterval(() => {
        updateMetrics();
        updateCharts();
    }, 30000);
    
    // Simulate real-time data updates
    setInterval(() => {
        simulateRealTimeActivity();
    }, 45000);
}

// Interactive Notifications
function createInteractiveNotifications() {
    const notification = document.createElement('div');
    notification.className = 'interactive-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <h4>🎉 Welcome to InventoryPro!</h4>
            <p>Try these interactive features:</p>
            <ul>
                <li>Click on metric cards to see details</li>
                <li>Drag cards to charts</li>
                <li>Use keyboard shortcuts (Ctrl+K for search)</li>
                <li>Hover over elements for animations</li>
            </ul>
            <button onclick="this.parentElement.parentElement.remove()">Got it!</button>
        </div>
    `;
    
    setTimeout(() => {
        document.body.appendChild(notification);
    }, 2000);
}

// Setup Animations
function setupAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.metric-card, .chart-container, .recent-activity, .quick-actions');
    animateElements.forEach(el => observer.observe(el));
}

// Metric Card Interactions
function setupMetricCardInteractions() {
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
        // Hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
            card.style.boxShadow = 'var(--shadow-2xl)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = 'var(--shadow-sm)';
        });
        
        // Click to expand
        card.addEventListener('click', () => {
            expandMetricCard(card);
        });
    });
}

// Chart Interactions
function setupChartInteractions() {
    const chartContainers = document.querySelectorAll('.chart-container');
    chartContainers.forEach(container => {
        // Hover to highlight
        container.addEventListener('mouseenter', () => {
            container.style.borderColor = 'var(--primary-color)';
            container.style.transform = 'scale(1.01)';
        });
        
        container.addEventListener('mouseleave', () => {
            container.style.borderColor = 'var(--border-color)';
            container.style.transform = 'scale(1)';
        });
        
        // Click to fullscreen
        container.addEventListener('dblclick', () => {
            toggleChartFullscreen(container);
        });
    });
}

// Table Interactions
function setupTableInteractions() {
    const tableRows = document.querySelectorAll('.data-table tbody tr');
    tableRows.forEach(row => {
        // Row selection
        row.addEventListener('click', () => {
            tableRows.forEach(r => r.classList.remove('selected'));
            row.classList.add('selected');
        });
        
        // Hover effects
        row.addEventListener('mouseenter', () => {
            row.style.backgroundColor = 'var(--neutral-100)';
            row.style.transform = 'translateX(4px)';
        });
        
        row.addEventListener('mouseleave', () => {
            row.style.backgroundColor = '';
            row.style.transform = 'translateX(0)';
        });
    });
}

// Form Enhancements
function setupFormEnhancements() {
    const formInputs = document.querySelectorAll('.form-control');
    formInputs.forEach(input => {
        // Real-time validation
        input.addEventListener('input', () => {
            validateInput(input);
        });
        
        // Focus effects
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
            validateInput(input);
        });
    });
}

// Utility Functions for Interactions
function createRippleEffect(e) {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

function addButtonAnimation(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
}

function showMetricDetails(card) {
    const metricType = card.querySelector('h3').textContent;
    const metricValue = card.querySelector('.metric-value').textContent;
    
    showToast(`${metricType}: ${metricValue}`, 'info');
}

function expandMetricCard(card) {
    card.classList.toggle('expanded');
    if (card.classList.contains('expanded')) {
        card.style.height = 'auto';
        card.style.minHeight = '300px';
    } else {
        card.style.height = '';
        card.style.minHeight = '';
    }
}

function toggleChartFullscreen(container) {
    container.classList.toggle('fullscreen');
    if (container.classList.contains('fullscreen')) {
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100vw';
        container.style.height = '100vh';
        container.style.zIndex = '10000';
        container.style.borderRadius = '0';
    } else {
        container.style.position = '';
        container.style.top = '';
        container.style.left = '';
        container.style.width = '';
        container.style.height = '';
        container.style.zIndex = '';
        container.style.borderRadius = '';
    }
}

function addMetricToChart(card) {
    const metricType = card.querySelector('h3').textContent;
    const metricValue = card.querySelector('.metric-value').textContent;
    
    showToast(`Added ${metricType} to chart!`, 'success');
    // Here you could actually update the chart data
}

function validateInput(input) {
    const value = input.value.trim();
    const fieldName = input.name;
    
    // Remove existing validation classes
    input.classList.remove('valid', 'invalid');
    
    if (value === '') {
        input.classList.add('invalid');
        return false;
    }
    
    // Field-specific validation
    switch (fieldName) {
        case 'price':
            if (isNaN(value) || parseFloat(value) <= 0) {
                input.classList.add('invalid');
                return false;
            }
            break;
        case 'stock':
            if (isNaN(value) || parseInt(value) < 0) {
                input.classList.add('invalid');
                return false;
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                input.classList.add('invalid');
                return false;
            }
            break;
    }
    
    input.classList.add('valid');
    return true;
}

function closeAllModals() {
    const modals = document.querySelectorAll('.edit-form-overlay, .interactive-notification');
    modals.forEach(modal => modal.remove());
}

function updateCharts() {
    // Update chart data if charts exist
    if (window.salesChart) {
        updateSalesChart();
    }
}

// Missing functions that are referenced
function showMetricDetails(card) {
    const metricType = card.querySelector('h3')?.textContent || 'Metric';
    const metricValue = card.querySelector('.metric-value')?.textContent || '0';
    
    showToast(`${metricType}: ${metricValue}`, 'info');
}

function createRippleEffect(e) {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

function addButtonAnimation(btn) {
    btn.classList.add('clicked');
    setTimeout(() => btn.classList.remove('clicked'), 200);
}

function addMetricToChart(metricCard) {
    const metricType = metricCard.querySelector('h3')?.textContent || 'Metric';
    showToast(`Added ${metricType} to chart!`, 'success');
}

function simulateRealTimeActivity() {
    // Simulate new activities
    const activities = [
        'New product added to inventory',
        'Sale recorded successfully',
        'Customer profile updated',
        'Low stock alert triggered'
    ];
    
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    addActivity('info', randomActivity, 'System update');
}

// Enhanced Toast with Actions
function showInteractiveToast(message, type = 'info', actions = []) {
    const toastContainer = document.querySelector('.toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type} interactive`;
    
    let actionButtons = '';
    if (actions.length > 0) {
        actionButtons = '<div class="toast-actions">';
        actions.forEach(action => {
            actionButtons += `<button onclick="${action.onclick}">${action.text}</button>`;
        });
        actionButtons += '</div>';
    }
    
    toast.innerHTML = `
        <div class="toast-content">${message}</div>
        ${actionButtons}
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 8 seconds for interactive toasts
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 8000);
}

// Initialize inventory page
function initializeInventoryPage() {
    console.log('Initializing inventory page...');
    displayInventory();
    updateInventoryMetrics();
    
    // Auto-generate SKU for new products
    const skuInput = document.getElementById('sku');
    if (skuInput) {
        skuInput.value = generateSKU();
    }
}

// Update inventory-specific metrics
function updateInventoryMetrics() {
    const totalProductsCount = document.getElementById('totalProductsCount');
    const lowStockCount = document.getElementById('lowStockCount');
    const totalInventoryValue = document.getElementById('totalInventoryValue');
    const totalCategories = document.getElementById('totalCategories');
    
    if (totalProductsCount) {
        totalProductsCount.textContent = inventory.length;
    }
    
    if (lowStockCount) {
        const lowStock = inventory.filter(item => item.stock < 10).length;
        lowStockCount.textContent = lowStock;
    }
    
    if (totalInventoryValue) {
        const totalValue = inventory.reduce((sum, item) => sum + (item.price * item.stock), 0);
        totalInventoryValue.textContent = `₹${totalValue.toFixed(2)}`;
    }
    
    if (totalCategories) {
        const categories = new Set(inventory.map(item => item.category));
        totalCategories.textContent = categories.size;
    }
}

// Enhanced inventory search and filtering
function handleInventorySearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#inventoryTable tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const shouldShow = text.includes(searchTerm);
        row.style.display = shouldShow ? '' : 'none';
        
        // Add highlight effect for search terms
        if (searchTerm && shouldShow) {
            highlightSearchTerm(row, searchTerm);
        } else {
            removeHighlight(row);
        }
    });
}

function highlightSearchTerm(row, searchTerm) {
    const cells = row.querySelectorAll('td');
    cells.forEach(cell => {
        const text = cell.textContent;
        if (text.toLowerCase().includes(searchTerm)) {
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            cell.innerHTML = text.replace(regex, '<mark style="background: var(--warning-lighter); padding: 0.1rem 0.2rem; border-radius: 0.2rem;">$1</mark>');
        }
    });
}

function removeHighlight(row) {
    const cells = row.querySelectorAll('td');
    cells.forEach(cell => {
        const text = cell.textContent;
        // Remove mark tags but keep the text
        if (cell.innerHTML.includes('<mark>')) {
            cell.innerHTML = text;
        }
    });
}

// Enhanced category filtering
function handleCategoryFilter(e) {
    const category = e.target.value;
    const rows = document.querySelectorAll('#inventoryTable tbody tr');
    
    rows.forEach(row => {
        if (!category || category === '') {
            row.style.display = '';
        } else {
            const categoryCell = row.querySelector('td:nth-child(4)');
            if (categoryCell && categoryCell.textContent === category) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    });
    
    // Update metrics for filtered view
    updateFilteredMetrics(category);
}

function updateFilteredMetrics(category) {
    const filteredInventory = category ? inventory.filter(item => item.category === category) : inventory;
    
    const totalProductsCount = document.getElementById('totalProductsCount');
    const lowStockCount = document.getElementById('lowStockCount');
    const totalInventoryValue = document.getElementById('totalInventoryValue');
    
    if (totalProductsCount) {
        totalProductsCount.textContent = filteredInventory.length;
    }
    
    if (lowStockCount) {
        const lowStock = filteredInventory.filter(item => item.stock < 10).length;
        lowStockCount.textContent = lowStock;
    }
    
    if (totalInventoryValue) {
        const totalValue = filteredInventory.reduce((sum, item) => sum + (item.price * item.stock), 0);
        totalInventoryValue.textContent = `₹${totalValue.toFixed(2)}`;
    }
}

// Enhanced export functionality
function exportInventory() {
    try {
        const data = {
            inventory: inventory,
            exportDate: new Date().toISOString(),
            totalProducts: inventory.length,
            totalValue: inventory.reduce((sum, item) => sum + (item.price * item.stock), 0),
            categories: [...new Set(inventory.map(item => item.category))],
            suppliers: [...new Set(inventory.map(item => item.supplier))]
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `inventory-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('Inventory exported successfully!', 'success');
        
        // Add activity
        addActivity('inventory', 'Inventory exported', `Exported ${inventory.length} products`);
        
    } catch (error) {
        console.error('Export failed:', error);
        showToast('Export failed. Please try again.', 'error');
    }
}

// Bulk operations
function bulkDeleteProducts() {
    const selectedProducts = getSelectedProducts();
    if (selectedProducts.length === 0) {
        showToast('Please select products to delete', 'warning');
        return;
    }
    
    if (confirm(`Are you sure you want to delete ${selectedProducts.length} selected products? This action cannot be undone.`)) {
        selectedProducts.forEach(productId => {
            const productIndex = inventory.findIndex(item => item.id === productId);
            if (productIndex !== -1) {
                const deletedProduct = inventory[productIndex];
                inventory.splice(productIndex, 1);
                
                // Add activity
                addActivity('inventory', `Bulk deleted: ${deletedProduct.name}`, 'Product removed in bulk operation');
            }
        });
        
        saveData();
        displayInventory();
        updateMetrics();
        updateInventoryMetrics();
        
        showToast(`Successfully deleted ${selectedProducts.length} products`, 'success');
    }
}

function getSelectedProducts() {
    const checkboxes = document.querySelectorAll('#inventoryTable tbody input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

// Add bulk selection functionality
function setupBulkSelection() {
    const table = document.querySelector('#inventoryTable');
    if (!table) return;
    
    // Add select all checkbox to header
    const thead = table.querySelector('thead tr');
    if (thead) {
        const selectAllCell = document.createElement('th');
        selectAllCell.style.width = '50px';
        selectAllCell.innerHTML = `
            <input type="checkbox" id="selectAll" onchange="toggleSelectAll(this)">
        `;
        thead.insertBefore(selectAllCell, thead.firstChild);
    }
    
    // Add checkboxes to each row
    const tbody = table.querySelector('tbody');
    if (tbody) {
        tbody.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                updateSelectAllCheckbox();
            }
        });
    }
}

function toggleSelectAll(checkbox) {
    const rowCheckboxes = document.querySelectorAll('#inventoryTable tbody input[type="checkbox"]');
    rowCheckboxes.forEach(cb => {
        cb.checked = checkbox.checked;
    });
}

function updateSelectAllCheckbox() {
    const selectAll = document.getElementById('selectAll');
    const rowCheckboxes = document.querySelectorAll('#inventoryTable tbody input[type="checkbox"]');
    const checkedCount = Array.from(rowCheckboxes).filter(cb => cb.checked).length;
    
    if (checkedCount === 0) {
        selectAll.checked = false;
        selectAll.indeterminate = false;
    } else if (checkedCount === rowCheckboxes.length) {
        selectAll.checked = true;
        selectAll.indeterminate = false;
    } else {
        selectAll.checked = false;
        selectAll.indeterminate = true;
    }
}

// Enhanced display inventory with bulk selection
function displayInventory() {
    const table = document.querySelector("#inventoryTable tbody");
    if (!table) {
        console.warn('Inventory table not found');
        return;
    }
    
    console.log('Displaying inventory:', inventory);
    
    table.innerHTML = "";
    
    if (inventory.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                <i class="fas fa-box-open" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>No products in inventory yet.</p>
                <p>Click "Add Product" to get started!</p>
            </td>
        `;
        table.appendChild(emptyRow);
        return;
    }
    
    inventory.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <input type="checkbox" value="${item.id}" class="product-checkbox">
            </td>
            <td>
                <div class="product-info">
                    <strong>${item.name}</strong>
                    <small>SKU: ${item.sku}</small>
                    ${item.description ? `<br><small style="color: var(--text-muted);">${item.description}</small>` : ''}
                </div>
            </td>
            <td>₹${item.price.toFixed(2)}</td>
            <td>
                <span class="stock-amount ${item.stock < 10 ? 'low-stock' : ''}">${item.stock}</span>
            </td>
            <td>${item.category}</td>
            <td>${item.supplier}</td>
            <td>
                <span class="status-badge ${item.status}">${item.status}</span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-secondary btn-sm" onclick="editProduct('${item.id}')" title="Edit Product">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct('${item.id}')" title="Delete Product">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        table.appendChild(row);
    });
    
    // Setup bulk selection after displaying inventory
    setupBulkSelection();
}

// Add bulk operations buttons to inventory page
function addBulkOperationsButtons() {
    const tableHeader = document.querySelector('.table-header');
    if (!tableHeader) return;
    
    const bulkActions = document.createElement('div');
    bulkActions.className = 'bulk-actions';
    bulkActions.style.display = 'none';
    bulkActions.innerHTML = `
        <button class="btn btn-danger btn-sm" onclick="bulkDeleteProducts()">
            <i class="fas fa-trash"></i>
            Delete Selected
        </button>
        <button class="btn btn-secondary btn-sm" onclick="clearSelection()">
            <i class="fas fa-times"></i>
            Clear Selection
        </button>
    `;
    
    tableHeader.appendChild(bulkActions);
    
    // Show/hide bulk actions based on selection
    const observer = new MutationObserver(() => {
        const selectedCount = document.querySelectorAll('#inventoryTable tbody input[type="checkbox"]:checked').length;
        bulkActions.style.display = selectedCount > 0 ? 'flex' : 'none';
    });
    
    observer.observe(table, { childList: true, subtree: true });
}

function clearSelection() {
    const checkboxes = document.querySelectorAll('#inventoryTable tbody input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);
    updateSelectAllCheckbox();
}

// Initialize bulk operations
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('inventory.html') || window.location.pathname.includes('inventory')) {
        setTimeout(() => {
            addBulkOperationsButtons();
        }, 1000);
    }
});
