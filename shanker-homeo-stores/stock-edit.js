// Backend API configuration
const API_URL = (typeof API_CONFIG !== 'undefined' && API_CONFIG) ? API_CONFIG.apiUrl : null;

let currentUser = JSON.parse(localStorage.getItem('currentUser'));
let editingProductId = null;
let allProductsCache = [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = localStorage.getItem('token');

    if (!currentUser) {
        alert('Please login first.');
        window.location.href = 'login.html';
        return;
    }

    // Allow owners and employees to access stock editing
    const isOwnerOrEmp = currentUser.accountType === 'owner' || 
                         currentUser.accountType === 'employee' || 
                         currentUser.roles?.includes('employee') || 
                         currentUser.roles?.includes('owner');

    if (!isOwnerOrEmp) {
        alert('Customers do not have access to stock editing.');
        window.location.href = 'index.html';
        return;
    }

    const userNameEl = document.getElementById('userName');
    if (userNameEl) userNameEl.textContent = currentUser.name;
    loadStockData();
});

// Load stock data from backend or localStorage
async function loadStockData() {
    let products = [];
    if (API_URL) {
        try {
            const response = await fetch(`${API_URL}/products`);
            if (response.ok) {
                const data = await response.json();
                products = data.products || [];
            }
        } catch (error) {
            console.warn('Backend unavailable, reading local stock catalog:', error.message);
        }
    }

    if (!products || products.length === 0) {
        products = JSON.parse(localStorage.getItem('products') || '[]');
    }

    // Default sample products if none exist
    if (!products || products.length === 0) {
        products = [
            {
                id: 1,
                medicine_name: 'Arnica Montana 200 CH',
                brand_name: 'Dr. Reckeweg',
                batch_no: 'ARN001',
                batch_number: 'ARN001',
                mgf_date: '2024-01-15',
                manufacturing_date: '2024-01-15',
                exp_date: '2026-01-15',
                expiry_date: '2026-01-15',
                quantity: 50,
                price: 120,
                location: 'Shelf A1',
                note: 'Effective for muscle pain and bruises',
                category: 'homeopathic',
                images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60']
            },
            {
                id: 2,
                medicine_name: 'Pure Aloe Vera Skin Gel',
                brand_name: 'Herbal Care',
                batch_no: 'ALO002',
                batch_number: 'ALO002',
                mgf_date: '2024-02-20',
                manufacturing_date: '2024-02-20',
                exp_date: '2026-02-20',
                expiry_date: '2026-02-20',
                quantity: 30,
                price: 250,
                location: 'Shelf B2',
                note: 'Natural skin moisturizer',
                category: 'cosmetic',
                images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60']
            }
        ];
        localStorage.setItem('products', JSON.stringify(products));
    }

    allProductsCache = products;
    renderStockTable(products);
}

// Render stock table matching all 12 columns in stock-edit.html
function renderStockTable(products) {
    const tableBody = document.getElementById('stockTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    if (!products || products.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="12" style="text-align: center; padding: 2rem; color: #666;">No products found. Click "+ Add New Product" above to add medicines.</td></tr>';
        return;
    }

    products.forEach(product => {
        const row = document.createElement('tr');
        const stockStatus = getStockStatus(product.quantity);
        const mainImage = (product.images && product.images.length > 0) ? product.images[0] : (product.image || 'https://via.placeholder.com/50x50?text=No+Img');
        const batch = product.batch_no || product.batch_number || 'N/A';
        const mgf = formatDate(product.mgf_date || product.manufacturing_date);
        const exp = formatDate(product.exp_date || product.expiry_date);

        row.innerHTML = `
            <td>
                <img src="${mainImage}" alt="${product.medicine_name}" style="width: 45px; height: 45px; object-fit: cover; border-radius: 6px;" onerror="this.src='https://via.placeholder.com/45x45?text=No+Img'">
            </td>
            <td><strong>${product.medicine_name}</strong></td>
            <td>${product.brand_name || 'N/A'}</td>
            <td><code>${batch}</code></td>
            <td>${mgf}</td>
            <td>${exp}</td>
            <td><strong>${product.quantity}</strong></td>
            <td>₹${product.price}</td>
            <td><span class="status-badge" style="background: ${product.category === 'cosmetic' ? '#f3e5f5' : '#e0f2f1'}; color: ${product.category === 'cosmetic' ? '#6a1b9a' : '#006064'};">${product.category || 'homeopathic'}</span></td>
            <td>${product.location || 'N/A'}</td>
            <td>${product.note || '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editProduct(${product.id})">✏️ Edit</button>
                    <button class="delete-btn" onclick="deleteProduct(${product.id})">🗑️ Delete</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Get stock status helper
function getStockStatus(quantity) {
    if (quantity === 0) {
        return { class: 'out-of-stock', text: 'Out of Stock' };
    } else if (quantity < 10) {
        return { class: 'low-stock', text: 'Low Stock' };
    } else {
        return { class: 'in-stock', text: 'In Stock' };
    }
}

// Search stock
function searchStock() {
    const input = document.getElementById('searchInput');
    const term = input ? input.value.trim().toLowerCase() : '';

    if (!term) {
        renderStockTable(allProductsCache);
        return;
    }

    const filtered = allProductsCache.filter(p => {
        const name = (p.medicine_name || '').toLowerCase();
        const brand = (p.brand_name || '').toLowerCase();
        const batch = (p.batch_no || p.batch_number || '').toLowerCase();
        const loc = (p.location || '').toLowerCase();
        const note = (p.note || '').toLowerCase();
        return name.includes(term) || brand.includes(term) || batch.includes(term) || loc.includes(term) || note.includes(term);
    });

    renderStockTable(filtered);
}

// Open modal to add new product
function openAddModal() {
    editingProductId = null;
    const form = document.getElementById('productForm');
    if (form) form.reset();

    const titleEl = document.getElementById('modalTitle');
    if (titleEl) titleEl.textContent = 'Add New Product';

    const preview = document.getElementById('imagePreview');
    if (preview) preview.innerHTML = '';

    const modal = document.getElementById('productModal');
    if (modal) modal.style.display = 'block';
}

// Alias for add new product
function addNewProduct() {
    openAddModal();
}

// Edit product
async function editProduct(productId) {
    let product = allProductsCache.find(p => String(p.id) === String(productId));

    if (!product && API_URL) {
        try {
            const response = await fetch(`${API_URL}/products/${productId}`);
            if (response.ok) {
                const data = await response.json();
                product = data.product;
            }
        } catch (error) {
            console.warn('Backend unavailable, using cached product:', error.message);
        }
    }

    if (!product) {
        const localProducts = JSON.parse(localStorage.getItem('products') || '[]');
        product = localProducts.find(p => String(p.id) === String(productId));
    }

    if (product) {
        openEditModal(product);
    } else {
        alert('Could not find product details for ID: ' + productId);
    }
}

// Open edit modal and populate values
function openEditModal(product) {
    editingProductId = product.id;

    const titleEl = document.getElementById('modalTitle');
    if (titleEl) titleEl.textContent = 'Edit Product: ' + product.medicine_name;

    const idInput = document.getElementById('productId');
    if (idInput) idInput.value = product.id;

    document.getElementById('medicineName').value = product.medicine_name || '';
    document.getElementById('brandName').value = product.brand_name || '';
    document.getElementById('batchNo').value = product.batch_no || product.batch_number || '';
    document.getElementById('mgfDate').value = formatDateForInput(product.mgf_date || product.manufacturing_date);
    document.getElementById('expDate').value = formatDateForInput(product.exp_date || product.expiry_date);
    document.getElementById('quantity').value = (product.quantity !== undefined) ? product.quantity : 0;
    document.getElementById('price').value = (product.price !== undefined) ? product.price : 0;
    document.getElementById('location').value = product.location || '';
    document.getElementById('note').value = product.note || '';
    document.getElementById('category').value = product.category || 'homeopathic';

    // Display existing images
    const imagePreview = document.getElementById('imagePreview');
    if (imagePreview) {
        imagePreview.innerHTML = '';
        const images = product.images || (product.image ? [product.image] : []);
        images.forEach((imgSrc) => {
            const imgContainer = document.createElement('div');
            imgContainer.style.cssText = 'position: relative; display: inline-block; margin: 0.3rem;';
            imgContainer.innerHTML = `
                <img src="${imgSrc}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 6px; border: 1px solid #ccc;">
                <button type="button" onclick="this.parentElement.remove()" style="position: absolute; top: -5px; right: -5px; background: #dc3545; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; font-size: 12px; line-height: 1;">×</button>
            `;
            imagePreview.appendChild(imgContainer);
        });
    }

    const modal = document.getElementById('productModal');
    if (modal) modal.style.display = 'block';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('productModal');
    if (modal) modal.style.display = 'none';
    editingProductId = null;

    const form = document.getElementById('productForm');
    if (form) form.reset();

    const imagePreview = document.getElementById('imagePreview');
    if (imagePreview) imagePreview.innerHTML = '';
}

// Handle image upload from file picker
function handleImageUpload(event) {
    const files = event.target.files;
    const imagePreview = document.getElementById('imagePreview');
    if (!files || !imagePreview) return;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = function(e) {
            const imgContainer = document.createElement('div');
            imgContainer.style.cssText = 'position: relative; display: inline-block; margin: 0.3rem;';
            imgContainer.innerHTML = `
                <img src="${e.target.result}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 6px; border: 1px solid #ccc;">
                <button type="button" onclick="this.parentElement.remove()" style="position: absolute; top: -5px; right: -5px; background: #dc3545; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; font-size: 12px; line-height: 1;">×</button>
            `;
            imagePreview.appendChild(imgContainer);
        };

        reader.readAsDataURL(file);
    }
}

// Save product (Add or Edit)
async function saveProduct(event) {
    if (event) event.preventDefault();

    const token = localStorage.getItem('token');
    const medicineName = document.getElementById('medicineName').value.trim();
    const brandName = document.getElementById('brandName').value.trim();
    const batch = document.getElementById('batchNo').value.trim();
    const mgf = document.getElementById('mgfDate').value;
    const exp = document.getElementById('expDate').value;
    const quantity = parseInt(document.getElementById('quantity').value) || 0;
    const price = parseFloat(document.getElementById('price').value) || 0;
    const location = document.getElementById('location').value.trim();
    const note = document.getElementById('note').value.trim();
    const category = document.getElementById('category').value;

    if (!medicineName || !brandName) {
        alert('Please fill in required fields (Medicine Name, Brand)');
        return;
    }

    // Collect images
    const imagePreview = document.getElementById('imagePreview');
    const images = [];
    if (imagePreview) {
        Array.from(imagePreview.children).forEach(container => {
            const img = container.querySelector('img');
            if (img && img.src) {
                images.push(img.src);
            }
        });
    }

    const fallbackImg = images.length > 0 ? images : ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60'];

    const productPayload = {
        medicine_name: medicineName,
        brand_name: brandName,
        batch_no: batch,
        batch_number: batch,
        mgf_date: mgf,
        manufacturing_date: mgf,
        exp_date: exp,
        expiry_date: exp,
        quantity: quantity,
        price: price,
        location: location,
        note: note,
        category: category,
        images: fallbackImg
    };

    // If API is available, try server update
    if (API_URL && token) {
        try {
            if (editingProductId) {
                await fetch(`${API_URL}/products/${editingProductId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(productPayload)
                });
            } else {
                await fetch(`${API_URL}/products`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(productPayload)
                });
            }
        } catch (error) {
            console.warn('Backend update failed, saving locally:', error.message);
        }
    }

    // Update in localStorage
    let localProducts = JSON.parse(localStorage.getItem('products') || '[]');
    if (editingProductId) {
        const index = localProducts.findIndex(p => String(p.id) === String(editingProductId));
        if (index !== -1) {
            localProducts[index] = { ...localProducts[index], ...productPayload, id: Number(editingProductId) };
        } else {
            localProducts.push({ ...productPayload, id: Number(editingProductId) });
        }
    } else {
        const maxId = localProducts.length > 0 ? Math.max(...localProducts.map(p => Number(p.id) || 0)) : 0;
        const newId = maxId + 1;
        localProducts.push({ ...productPayload, id: newId });
    }

    localStorage.setItem('products', JSON.stringify(localProducts));
    alert(editingProductId ? 'Product updated successfully!' : 'Product added successfully!');
    closeModal();
    loadStockData();
}

// Delete product
async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }

    const token = localStorage.getItem('token');
    if (API_URL && token) {
        try {
            await fetch(`${API_URL}/products/${productId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (error) {
            console.warn('Backend delete failed, removing locally:', error.message);
        }
    }

    let localProducts = JSON.parse(localStorage.getItem('products') || '[]');
    localProducts = localProducts.filter(p => String(p.id) !== String(productId));
    localStorage.setItem('products', JSON.stringify(localProducts));

    alert('Product deleted successfully.');
    loadStockData();
}

// Navigation back to dashboard
function goBack() {
    window.location.href = 'owner-dashboard.html';
}

// Format date for table display
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

// Format date for HTML date input (YYYY-MM-DD)
function formatDateForInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
}

// Close modal when clicking on dark backdrop
window.onclick = function(event) {
    const modal = document.getElementById('productModal');
    if (event.target === modal) {
        closeModal();
    }
};

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}
