// Get stock data from localStorage
function getStockData() {
    const storedData = localStorage.getItem('stockData');
    if (storedData) {
        const data = JSON.parse(storedData);
        // Check if data has the new structure with category field
        if (data.length > 0 && data[0].category) {
            return data;
        }
        // Old structure detected, convert to new structure
        return convertToNewStructure(data);
    }

    // Sample product data with images and categories
    const sampleData = [
        {
            id: 1,
            medicine_name: "Arnica Montana",
            brand_name: "Dr. Reckeweg",
            batch_no: "ARN001",
            mgf_date: "2024-01-15",
            exp_date: "2027-01-15",
            quantity: 50,
            price: 150,
            location: "Shelf A-1",
            note: "Best seller",
            category: "homeopathic",
            image: "https://images.unsplash.com/photo-1556228578-0d85b1a4e3e5?w=400"
        },
        {
            id: 2,
            medicine_name: "Nux Vomica",
            brand_name: "SBL",
            batch_no: "NUX002",
            mgf_date: "2024-02-20",
            exp_date: "2027-02-20",
            quantity: 8,
            price: 120,
            location: "Shelf A-2",
            note: "Low stock, reorder soon",
            category: "homeopathic",
            image: "https://images.unsplash.com/photo-1587854692157-c309b9d1eb44?w=400"
        },
        {
            id: 3,
            medicine_name: "Rhus Tox",
            brand_name: "Schwabe",
            batch_no: "RHS003",
            mgf_date: "2024-03-10",
            exp_date: "2027-03-10",
            quantity: 0,
            price: 140,
            location: "Shelf B-1",
            note: "Out of stock",
            category: "homeopathic",
            image: "https://images.unsplash.com/photo-1598445542092-33f825e0a8d5?w=400"
        },
        {
            id: 4,
            medicine_name: "Aloe Vera Gel",
            brand_name: "Himalaya",
            batch_no: "ALV001",
            mgf_date: "2024-04-05",
            exp_date: "2026-04-05",
            quantity: 35,
            price: 180,
            location: "Shelf C-1",
            note: "Popular cosmetic",
            category: "cosmetic",
            image: "https://images.unsplash.com/photo-1556228720-195a672e8a038?w=400"
        },
        {
            id: 5,
            medicine_name: "Neem Face Wash",
            brand_name: "Himalaya",
            batch_no: "NMF002",
            mgf_date: "2024-05-12",
            exp_date: "2026-05-12",
            quantity: 25,
            price: 95,
            location: "Shelf C-2",
            note: "Skin care",
            category: "cosmetic",
            image: "https://images.unsplash.com/photo-1556228847-44c9c760d664?w=400"
        },
        {
            id: 6,
            medicine_name: "Bryonia",
            brand_name: "Dr. Reckeweg",
            batch_no: "BRY004",
            mgf_date: "2024-04-05",
            exp_date: "2027-04-05",
            quantity: 35,
            price: 130,
            location: "Shelf B-2",
            note: "",
            category: "homeopathic",
            image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b0?w=400"
        },
        {
            id: 7,
            medicine_name: "Turmeric Cream",
            brand_name: "Himalaya",
            batch_no: "TRC003",
            mgf_date: "2024-06-18",
            exp_date: "2026-06-18",
            quantity: 40,
            price: 220,
            location: "Shelf C-3",
            note: "Anti-aging",
            category: "cosmetic",
            image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400"
        },
        {
            id: 8,
            medicine_name: "Sulphur",
            brand_name: "SBL",
            batch_no: "SUL008",
            mgf_date: "2024-08-30",
            exp_date: "2027-08-30",
            quantity: 30,
            price: 135,
            location: "Shelf D-2",
            note: "",
            category: "homeopathic",
            image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400"
        },
        {
            id: 9,
            medicine_name: "Vitamin C Serum",
            brand_name: "Plum",
            batch_no: "VCS004",
            mgf_date: "2024-07-22",
            exp_date: "2026-07-22",
            quantity: 20,
            price: 450,
            location: "Shelf C-4",
            note: "Brightening",
            category: "cosmetic",
            image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400"
        },
        {
            id: 10,
            medicine_name: "Calcarea Carb",
            brand_name: "Schwabe",
            batch_no: "CAL009",
            mgf_date: "2024-09-14",
            exp_date: "2027-09-14",
            quantity: 45,
            price: 155,
            location: "Shelf E-1",
            note: "General health",
            category: "homeopathic",
            image: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=400"
        }
    ];

    localStorage.setItem('stockData', JSON.stringify(sampleData));
    return sampleData;
}

// Convert old structure to new structure
function convertToNewStructure(oldData) {
    return oldData.map(item => ({
        ...item,
        category: 'homeopathic', // Default to homeopathic for old data
        image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4e3e5?w=400' // Default image
    }));
}

let allProducts = getStockData();
let filteredProducts = allProducts;
let currentUser = JSON.parse(localStorage.getItem('currentUser'));
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateCartCount();
});

// Load products
function loadProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';

    filteredProducts.forEach(product => {
        const categoryClass = product.category === 'homeopathic' ? 'status-homeopathic' : 'status-cosmetic';
        const categoryText = product.category === 'homeopathic' ? 'Homeopathic' : 'Cosmetic';

        const card = `
            <div class="product-card">
                <img src="${product.image}" alt="${product.medicine_name}" class="product-image" onerror="this.src='https://via.placeholder.com/400x200?text=No+Image'">
                <div class="product-info">
                    <span class="status-badge ${categoryClass}">${categoryText}</span>
                    <h3 class="product-name">${product.medicine_name}</h3>
                    <p class="product-brand">${product.brand_name}</p>
                    <p class="product-price">₹${product.price}</p>
                    <p class="product-location">📍 ${product.location || 'N/A'}</p>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">🛒 Add to Cart</button>
                </div>
            </div>
        `;
        grid.innerHTML += card;
    });
}

// Filter products by category
function filterProducts(category) {
    // Update active tab
    document.querySelectorAll('.category-tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');

    if (category === 'all') {
        filteredProducts = allProducts;
    } else {
        filteredProducts = allProducts.filter(product => product.category === category);
    }

    loadProducts();
}

// Search products
function searchProducts() {
    const searchTerm = document.querySelector('.search-input').value.toLowerCase();
    filteredProducts = allProducts.filter(product =>
        product.medicine_name.toLowerCase().includes(searchTerm) ||
        product.brand_name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    loadProducts();
}

// Add to cart
function addToCart(productId) {
    // Check if user is logged in
    currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        // Save intended action and redirect to login
        localStorage.setItem('intendedAction', 'addToCart');
        localStorage.setItem('intendedProductId', productId);
        alert('Please login to add items to your cart');
        window.location.href = 'login.html';
        return;
    }

    // Check if product is in stock
    const product = allProducts.find(p => p.id === productId);
    if (product.quantity === 0) {
        alert('This product is currently out of stock');
        return;
    }

    // Add to cart
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            medicine_name: product.medicine_name,
            price: product.price,
            quantity: 1,
            image: product.image
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert('Added to cart!');
}

// Update cart count
function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.textContent = `🛒 Cart (${cartCount})`;
    }
}