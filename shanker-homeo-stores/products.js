// Backend API configuration
const API_URL = (typeof API_CONFIG !== 'undefined' && API_CONFIG) ? API_CONFIG.apiUrl : null;

// Fallback to localStorage if backend is not available
const USE_LOCALSTORAGE_FALLBACK = !API_URL;

// State management for filters
let currentCategory = 'all';
let currentSearchTerm = '';

// Initialize localStorage products if not exists
function initializeLocalStorageProducts() {
    if (!localStorage.getItem('products')) {
        const defaultProducts = [
            {
                id: 1,
                medicine_name: 'Arnica Montana 200 CH',
                brand_name: 'Dr. Reckeweg',
                batch_number: 'ARN001',
                manufacturing_date: '2024-01-15',
                expiry_date: '2026-01-15',
                quantity: 50,
                price: 120,
                location: 'Shelf A1',
                note: 'Effective for muscle pain, bruises, and soreness',
                category: 'homeopathic',
                images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60']
            },
            {
                id: 2,
                medicine_name: 'Pure Aloe Vera Skin Gel',
                brand_name: 'Herbal Care',
                batch_number: 'ALO002',
                manufacturing_date: '2024-02-20',
                expiry_date: '2026-02-20',
                quantity: 30,
                price: 250,
                location: 'Shelf B2',
                note: 'Natural skin moisturizing and soothing formula',
                category: 'cosmetic',
                images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60']
            },
            {
                id: 3,
                medicine_name: 'Nux Vomica 30 CH',
                brand_name: 'SBL',
                batch_number: 'NUX003',
                manufacturing_date: '2024-03-10',
                expiry_date: '2026-03-10',
                quantity: 75,
                price: 85,
                location: 'Shelf A3',
                note: 'Relief from indigestion, gastric trouble, and bloating',
                category: 'homeopathic',
                images: ['https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop&q=60']
            },
            {
                id: 4,
                medicine_name: 'Calendula Antiseptic Cream',
                brand_name: 'Dr. Reckeweg',
                batch_number: 'CAL004',
                manufacturing_date: '2024-04-05',
                expiry_date: '2026-04-05',
                quantity: 40,
                price: 160,
                location: 'Shelf B1',
                note: 'Natural healing for cuts, burns, and dry cracked skin',
                category: 'cosmetic',
                images: ['https://images.unsplash.com/photo-1608248597359-0f4f9f75ecf4?w=500&auto=format&fit=crop&q=60']
            }
        ];
        localStorage.setItem('products', JSON.stringify(defaultProducts));
    }
}

// Get stock data with automatic fallback
async function getStockData() {
    if (USE_LOCALSTORAGE_FALLBACK) {
        initializeLocalStorageProducts();
        return JSON.parse(localStorage.getItem('products') || '[]');
    }

    try {
        const response = await fetch(`${API_URL}/products`);
        if (response.ok) {
            const data = await response.json();
            if (data.products && data.products.length > 0) {
                return data.products;
            }
        }
    } catch (error) {
        console.warn('Backend unavailable, using local product catalog:', error.message);
    }

    initializeLocalStorageProducts();
    return JSON.parse(localStorage.getItem('products') || '[]');
}

// Render products
async function renderProducts(searchTerm = currentSearchTerm, categoryFilter = currentCategory) {
    currentSearchTerm = searchTerm;
    currentCategory = categoryFilter;

    const products = await getStockData();
    const productsContainer = document.getElementById('productsGrid') || document.getElementById('productsContainer');
    
    if (!productsContainer) return;

    productsContainer.innerHTML = '';

    let filteredProducts = products;

    // Apply search filter
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product =>
            (product.medicine_name && product.medicine_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (product.brand_name && product.brand_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (product.note && product.note.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
        filteredProducts = filteredProducts.filter(product =>
            product.category === categoryFilter
        );
    }

    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem 1rem; color: #666; grid-column: 1 / -1;">
                <div style="font-size: 3rem; margin-bottom: 0.5rem;">🔍</div>
                <h3>No medicines or products found</h3>
                <p>Try searching for a different keyword or switch categories.</p>
            </div>
        `;
        return;
    }

    filteredProducts.forEach((product, index) => {
        const productCard = createProductCard(product, index);
        productsContainer.appendChild(productCard);
    });
}

// Create product card
function createProductCard(product, index) {
    const card = document.createElement('div');
    card.className = 'product-card animate-fade-in';
    card.style.animationDelay = `${index * 0.05}s`;
    card.onclick = () => viewProductDetails(product.id);

    const mainImage = product.images && product.images.length > 0 ? product.images[0] : (product.image || 'https://via.placeholder.com/300x200?text=No+Image');
    const stockStatus = getStockStatus(product.quantity);
    const categoryBadge = getCategoryBadge(product.category);

    card.innerHTML = `
        <div class="product-image-container">
            <img src="${mainImage}" alt="${product.medicine_name}" class="product-image" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
            <div class="product-badges">
                ${categoryBadge}
                ${stockStatus}
            </div>
        </div>
        <div class="product-info">
            <div class="product-category">${product.category}</div>
            <div class="product-name">${product.medicine_name}</div>
            <div class="product-brand">${product.brand_name}</div>
            <div class="product-price">₹${product.price}</div>
            <div class="product-location" style="color: #006064; font-size: 0.8rem;">✓ In Stock at Store</div>
            <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${product.id})">
                🛒 Add to Cart
            </button>
        </div>
    `;

    return card;
}

// Get stock status badge
function getStockStatus(quantity) {
    if (quantity === 0) {
        return '<span class="status-badge stock-badge out-of-stock" style="background: #ffebee; color: #c62828;">Out of Stock</span>';
    } else if (quantity < 10) {
        return '<span class="status-badge stock-badge low-stock" style="background: #fff8e1; color: #f57f17;">Low Stock</span>';
    } else {
        return '<span class="status-badge stock-badge in-stock" style="background: #e8f5e9; color: #2e7d32;">In Stock</span>';
    }
}

// Get category badge
function getCategoryBadge(category) {
    if (category === 'homeopathic') {
        return '<span class="status-badge status-homeopathic">Homeopathic</span>';
    } else if (category === 'cosmetic') {
        return '<span class="status-badge status-cosmetic">Cosmetic</span>';
    }
    return '';
}

// View product details
async function viewProductDetails(productId) {
    const products = await getStockData();
    const product = products.find(p => p.id === productId);
    if (product) {
        localStorage.setItem('selectedProduct', JSON.stringify(product));
    }
    localStorage.setItem('selectedProductId', productId);
    window.location.href = 'product-details.html';
}

// Add to cart
async function addToCart(productId) {
    const products = await getStockData();
    const product = products.find(p => p.id === productId);

    if (!product) {
        alert('Product not found');
        return;
    }

    if (product.quantity === 0) {
        alert('This product is out of stock');
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        if (existingItem.quantity < product.quantity) {
            existingItem.quantity += 1;
        } else {
            alert('Cannot add more than available stock');
            return;
        }
    } else {
        const images = product.images || (product.image ? [product.image] : []);
        cart.push({
            id: product.id,
            medicine_name: product.medicine_name,
            brand_name: product.brand_name,
            price: product.price,
            quantity: 1,
            images: images,
            maxQuantity: product.quantity
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert('Product added to cart!');
}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('#cartCount');
    cartCountElements.forEach(el => {
        el.textContent = cartCount;
    });
}

// Search function called by onkeyup in index.html and products.html
function searchProducts() {
    const searchInput = document.getElementById('searchInput') || document.querySelector('.search-input');
    const searchTerm = searchInput ? searchInput.value.trim() : '';
    renderProducts(searchTerm, currentCategory);
}

// Category filter function called by category tabs
function filterProducts(category, element) {
    currentCategory = category;

    // Update active tab UI
    const tabs = document.querySelectorAll('.category-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    if (element) {
        element.classList.add('active');
    } else {
        tabs.forEach(tab => {
            const text = tab.textContent.toLowerCase();
            if (category === 'all' && text.includes('all')) tab.classList.add('active');
            if (category === 'homeopathic' && text.includes('homeopathic')) tab.classList.add('active');
            if (category === 'cosmetic' && text.includes('cosmetic')) tab.classList.add('active');
        });
    }

    const searchInput = document.getElementById('searchInput') || document.querySelector('.search-input');
    const searchTerm = searchInput ? searchInput.value.trim() : '';
    renderProducts(searchTerm, currentCategory);
}

// Search functionality for input event listener
function handleSearch() {
    searchProducts();
}

// Category filter for select element
function handleCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter')?.value || 'all';
    filterProducts(categoryFilter);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateCartCount();

    // Add event listeners if elements exist
    const searchInput = document.getElementById('searchInput') || document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', handleCategoryFilter);
    }
});