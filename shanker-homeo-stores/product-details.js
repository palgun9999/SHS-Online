// Get selected product from localStorage
function getSelectedProduct() {
    const productData = localStorage.getItem('selectedProduct');
    if (productData) {
        return JSON.parse(productData);
    }
    return null;
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadProductDetails();
});

// Load product details
function loadProductDetails() {
    const product = getSelectedProduct();
    const container = document.getElementById('productDetails');

    if (!product) {
        container.innerHTML = '<div class="error-message">Product not found. <a href="index.html">Go back to products</a></div>';
        return;
    }

    const images = product.images || (product.image ? [product.image] : ['https://via.placeholder.com/400x300?text=No+Image']);
    const firstImage = images[0];

    // Determine stock status
    let stockStatusClass = 'stock-available';
    let stockStatusText = 'In Stock';
    let isOutOfStock = false;

    if (product.quantity === 0) {
        stockStatusClass = 'stock-out';
        stockStatusText = 'Out of Stock';
        isOutOfStock = true;
    } else if (product.quantity < 10) {
        stockStatusClass = 'stock-low';
        stockStatusText = 'Low Stock';
    }

    // Determine category styling
    const categoryClass = product.category === 'homeopathic' ? 'status-homeopathic' : 'status-cosmetic';
    const categoryText = product.category === 'homeopathic' ? 'Homeopathic' : 'Cosmetic';

    const productDetailsHTML = `
        <div class="main-image-container">
            <img id="mainImage" src="${firstImage}" alt="${product.medicine_name}" class="main-image" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
        </div>

        ${images.length > 1 ? `
            <div class="thumbnail-container">
                ${images.map((img, index) => `
                    <img src="${img}" alt="Thumbnail ${index + 1}" class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeMainImage('${img}', this)">
                `).join('')}
            </div>
        ` : ''}

        <div class="product-details-card">
            <div class="detail-header">
                <span class="status-badge ${categoryClass}">${categoryText}</span>
                <h2 class="detail-name">${product.medicine_name}</h2>
                <p class="detail-brand">Brand: ${product.brand_name}</p>
                <p class="detail-price">₹${product.price}</p>
                <span class="stock-status ${stockStatusClass}">${stockStatusText} (${product.quantity} available)</span>
            </div>

            <div class="detail-section">
                <h4>📋 Product Information</h4>
                <div class="detail-row">
                    <span class="detail-label">Batch Number:</span>
                    <span class="detail-value">${product.batch_no || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Manufacturing Date:</span>
                    <span class="detail-value">${formatDate(product.mgf_date)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Expiry Date:</span>
                    <span class="detail-value">${formatDate(product.exp_date)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Location:</span>
                    <span class="detail-value">${product.location || 'N/A'}</span>
                </div>
            </div>

            ${product.note ? `
                <div class="detail-section">
                    <h4>📝 Notes</h4>
                    <p class="detail-value">${product.note}</p>
                </div>
            ` : ''}

            <div class="action-buttons">
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})" ${isOutOfStock ? 'disabled' : ''}>
                    ${isOutOfStock ? '❌ Out of Stock' : '🛒 Add to Cart'}
                </button>
                <button class="back-to-products-btn" onclick="window.location.href='index.html'">
                    ← Back to Products
                </button>
            </div>
        </div>
    `;

    container.innerHTML = productDetailsHTML;
}

// Change main image
function changeMainImage(imageSrc, thumbnailElement) {
    const mainImage = document.getElementById('mainImage');
    mainImage.src = imageSrc;

    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });
    thumbnailElement.classList.add('active');
}

// Add to cart
function addToCart(productId) {
    const product = getSelectedProduct();
    if (!product || product.quantity === 0) {
        alert('This product is out of stock');
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        if (existingItem.quantity < product.quantity) {
            existingItem.quantity += 1;
            alert('Quantity updated in cart!');
        } else {
            alert('Maximum available quantity reached');
        }
    } else {
        const images = product.images || (product.image ? [product.image] : ['https://via.placeholder.com/100x100?text=No+Img']);
        cart.push({
            id: product.id,
            medicine_name: product.medicine_name,
            price: product.price,
            quantity: 1,
            images: images
        });
        alert('Product added to cart!');
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('#cartCount');
    cartCountElements.forEach(element => {
        element.textContent = cartCount;
    });
}

// Format date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}