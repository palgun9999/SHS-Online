// Get stock data from localStorage
function getStockData() {
    const storedData = localStorage.getItem('stockData');
    if (storedData) {
        const data = JSON.parse(storedData);
        // Check if data has new structure (has medicine_name field)
        if (data.length > 0 && data[0].medicine_name) {
            // Check if it has category field (newest structure)
            if (data[0].category !== undefined) {
                return data;
            }
            // Old structure without category, convert it
            return convertToNewStructure(data);
        }
        // Old structure detected, clear and use new structure
        localStorage.removeItem('stockData');
    }

    // Sample stock data with new structure including multiple images and categories
    const sampleData = [
        { id: 1, medicine_name: "Arnica Montana", brand_name: "Dr. Reckeweg", batch_no: "ARN001", mgf_date: "2024-01-15", exp_date: "2027-01-15", quantity: 50, price: 150, location: "Shelf A-1", note: "Best seller", category: "homeopathic", images: ["https://images.unsplash.com/photo-1556228578-0d85b1a4e3e5?w=400", "https://images.unsplash.com/photo-1587854692157-c309b9d1eb44?w=400"] },
        { id: 2, medicine_name: "Nux Vomica", brand_name: "SBL", batch_no: "NUX002", mgf_date: "2024-02-20", exp_date: "2027-02-20", quantity: 8, price: 120, location: "Shelf A-2", note: "Low stock, reorder soon", category: "homeopathic", images: ["https://images.unsplash.com/photo-1587854692157-c309b9d1eb44?w=400"] },
        { id: 3, medicine_name: "Rhus Tox", brand_name: "Schwabe", batch_no: "RHS003", mgf_date: "2024-03-10", exp_date: "2027-03-10", quantity: 0, price: 140, location: "Shelf B-1", note: "Out of stock", category: "homeopathic", images: ["https://images.unsplash.com/photo-1598445542092-33f825e0a8d5?w=400"] },
        { id: 4, medicine_name: "Aloe Vera Gel", brand_name: "Himalaya", batch_no: "ALV001", mgf_date: "2024-04-05", exp_date: "2026-04-05", quantity: 35, price: 180, location: "Shelf C-1", note: "Popular cosmetic", category: "cosmetic", images: ["https://images.unsplash.com/photo-1556228720-195a672e8a038?w=400", "https://images.unsplash.com/photo-1556228847-44c9c760d664?w=400"] },
        { id: 5, medicine_name: "Neem Face Wash", brand_name: "Himalaya", batch_no: "NMF002", mgf_date: "2024-05-12", exp_date: "2026-05-12", quantity: 25, price: 95, location: "Shelf C-2", note: "Skin care", category: "cosmetic", images: ["https://images.unsplash.com/photo-1556228847-44c9c760d664?w=400"] },
        { id: 6, medicine_name: "Bryonia", brand_name: "Dr. Reckeweg", batch_no: "BRY004", mgf_date: "2024-04-05", exp_date: "2027-04-05", quantity: 35, price: 130, location: "Shelf B-2", note: "", category: "homeopathic", images: ["https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b0?w=400"] },
        { id: 7, medicine_name: "Turmeric Cream", brand_name: "Himalaya", batch_no: "TRC003", mgf_date: "2024-06-18", exp_date: "2026-06-18", quantity: 40, price: 220, location: "Shelf C-3", note: "Anti-aging", category: "cosmetic", images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400", "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400"] },
        { id: 8, medicine_name: "Sulphur", brand_name: "SBL", batch_no: "SUL008", mgf_date: "2024-08-30", exp_date: "2027-08-30", quantity: 30, price: 135, location: "Shelf D-2", note: "", category: "homeopathic", images: ["https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400"] },
        { id: 9, medicine_name: "Vitamin C Serum", brand_name: "Plum", batch_no: "VCS004", mgf_date: "2024-07-22", exp_date: "2026-07-22", quantity: 20, price: 450, location: "Shelf C-4", note: "Brightening", category: "cosmetic", images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400"] },
        { id: 10, medicine_name: "Calcarea Carb", brand_name: "Schwabe", batch_no: "CAL009", mgf_date: "2024-09-14", exp_date: "2027-09-14", quantity: 45, price: 155, location: "Shelf E-1", note: "General health", category: "homeopathic", images: ["https://images.unsplash.com/photo-1551076805-e1869033e561?w=400"] }
    ];

    localStorage.setItem('stockData', JSON.stringify(sampleData));
    return sampleData;
}

// Convert old structure to new structure
function convertToNewStructure(oldData) {
    return oldData.map(item => ({
        ...item,
        category: 'homeopathic', // Default to homeopathic
        images: item.image ? [item.image] : ['https://images.unsplash.com/photo-1556228578-0d85b1a4e3e5?w=400'] // Convert single image to array
    }));
}

// Save stock data to localStorage
function saveStockData(data) {
    localStorage.setItem('stockData', JSON.stringify(data));
}

let stockData = getStockData();
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    if (!currentUser) {
        alert('Please login first.');
        window.location.href = 'login.html';
        return;
    }

    // Allow owners and employees to access stock management
    if (currentUser.accountType === 'customer' && !currentUser.roles?.includes('owner')) {
        alert('Customers do not have access to stock management.');
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('userName').textContent = currentUser.name;
    loadStockData();
});

// Load stock data
function loadStockData() {
    stockData = getStockData();
    const tbody = document.getElementById('stockTableBody');
    tbody.innerHTML = '';

    stockData.forEach(item => {
        const images = item.images || (item.image ? [item.image] : []);
        const firstImage = images[0] || 'https://via.placeholder.com/50x50?text=No+Img';

        const row = `
            <tr>
                <td><img src="${firstImage}" alt="${item.medicine_name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;" onerror="this.src='https://via.placeholder.com/50x50?text=No+Img'"></td>
                <td>${item.medicine_name}</td>
                <td>${item.brand_name}</td>
                <td>${item.batch_no}</td>
                <td>${formatDate(item.mgf_date)}</td>
                <td>${formatDate(item.exp_date)}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price}</td>
                <td><span class="status-badge ${item.category === 'homeopathic' ? 'status-homeopathic' : 'status-cosmetic'}">${item.category}</span></td>
                <td>${item.location || 'N/A'}</td>
                <td>${item.note || '-'}</td>
                <td>
                    <div class="action-buttons">
                        <button class="edit-btn" onclick="editProduct(${item.id})">Edit</button>
                        <button class="delete-btn" onclick="deleteProduct(${item.id})">Delete</button>
                    </div>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Open add modal
function openAddModal() {
    document.getElementById('modalTitle').textContent = 'Add New Product';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('imagePreview').innerHTML = ''; // Clear image preview
    document.getElementById('productModal').style.display = 'block';
    // Prevent body scrolling on mobile
    document.body.style.overflow = 'hidden';
}

// Edit product
function editProduct(id) {
    const product = stockData.find(item => item.id === id);
    if (!product) return;

    document.getElementById('modalTitle').textContent = 'Edit Product';
    document.getElementById('productId').value = product.id;
    document.getElementById('medicineName').value = product.medicine_name;
    document.getElementById('brandName').value = product.brand_name;
    document.getElementById('batchNo').value = product.batch_no;
    document.getElementById('mgfDate').value = product.mgf_date;
    document.getElementById('expDate').value = product.exp_date;
    document.getElementById('quantity').value = product.quantity;
    document.getElementById('price').value = product.price;
    document.getElementById('location').value = product.location || '';
    document.getElementById('note').value = product.note || '';
    document.getElementById('category').value = product.category || 'homeopathic';

    // Handle multiple images - convert old single image to array if needed
    const productImages = product.images || (product.image ? [product.image] : []);
    document.getElementById('imageUrl').value = JSON.stringify(productImages);

    // Show image preview with remove buttons
    updateImagePreview(productImages);

    document.getElementById('productModal').style.display = 'block';
    // Prevent body scrolling on mobile
    document.body.style.overflow = 'hidden';
}

// Handle image upload (multiple images)
function handleImageUpload(event) {
    const files = event.target.files;
    const imagePreview = document.getElementById('imagePreview');
    const currentImages = document.getElementById('imageUrl').value ? JSON.parse(document.getElementById('imageUrl').value) : [];

    Array.from(files).forEach(file => {
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert(`Image ${file.name} size must be less than 5MB`);
            return;
        }

        // Check file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alert(`Please upload a valid image file (JPG, PNG, GIF, or WebP) for ${file.name}`);
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            currentImages.push(e.target.result);
            document.getElementById('imageUrl').value = JSON.stringify(currentImages);
            updateImagePreview(currentImages);
        };
        reader.onerror = function() {
            alert('Error reading file. Please try again.');
        };
        reader.readAsDataURL(file);
    });
}

// Update image preview
function updateImagePreview(images) {
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.innerHTML = '';

    images.forEach((imgSrc, index) => {
        const imgContainer = document.createElement('div');
        imgContainer.style.position = 'relative';
        imgContainer.style.display = 'inline-block';

        const img = document.createElement('img');
        img.src = imgSrc;
        img.style.width = '100px';
        img.style.height = '100px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '5px';
        img.style.border = '2px solid #00838f';

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.textContent = '×';
        removeBtn.style.position = 'absolute';
        removeBtn.style.top = '-5px';
        removeBtn.style.right = '-5px';
        removeBtn.style.background = '#ff6b6b';
        removeBtn.style.color = 'white';
        removeBtn.style.border = 'none';
        removeBtn.style.borderRadius = '50%';
        removeBtn.style.width = '20px';
        removeBtn.style.height = '20px';
        removeBtn.style.cursor = 'pointer';
        removeBtn.style.fontSize = '12px';
        removeBtn.onclick = function() { removeImage(index); };

        imgContainer.appendChild(img);
        imgContainer.appendChild(removeBtn);
        imagePreview.appendChild(imgContainer);
    });
}

// Remove uploaded image
function removeImage(index) {
    const currentImages = document.getElementById('imageUrl').value ? JSON.parse(document.getElementById('imageUrl').value) : [];
    currentImages.splice(index, 1);
    document.getElementById('imageUrl').value = JSON.stringify(currentImages);
    updateImagePreview(currentImages);
}

// Save product (add or update)
function saveProduct(event) {
    event.preventDefault();

    const productId = document.getElementById('productId').value;
    const imageUrlValue = document.getElementById('imageUrl').value;
    const images = imageUrlValue ? JSON.parse(imageUrlValue) : ['https://images.unsplash.com/photo-1556228578-0d85b1a4e3e5?w=400'];

    const productData = {
        medicine_name: document.getElementById('medicineName').value,
        brand_name: document.getElementById('brandName').value,
        batch_no: document.getElementById('batchNo').value,
        mgf_date: document.getElementById('mgfDate').value,
        exp_date: document.getElementById('expDate').value,
        quantity: parseInt(document.getElementById('quantity').value),
        price: parseFloat(document.getElementById('price').value),
        location: document.getElementById('location').value,
        note: document.getElementById('note').value,
        category: document.getElementById('category').value,
        images: images
    };

    if (productId) {
        // Update existing product
        const index = stockData.findIndex(item => item.id === parseInt(productId));
        if (index !== -1) {
            stockData[index] = { ...stockData[index], ...productData };
            alert('Product updated successfully!');
        }
    } else {
        // Add new product
        const newId = stockData.length > 0 ? Math.max(...stockData.map(item => item.id)) + 1 : 1;
        stockData.push({ id: newId, ...productData });
        alert('Product added successfully!');
    }

    saveStockData(stockData);
    closeModal();
    loadStockData();
}

// Delete product
function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }

    stockData = stockData.filter(item => item.id !== id);
    saveStockData(stockData);
    loadStockData();
    alert('Product deleted successfully!');
}

// Close modal
function closeModal() {
    document.getElementById('productModal').style.display = 'none';
    document.getElementById('productForm').reset();
    // Restore body scrolling
    document.body.style.overflow = 'auto';
}

// Search functionality
function searchStock() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const tbody = document.getElementById('stockTableBody');
    tbody.innerHTML = '';

    const filteredData = stockData.filter(item =>
        item.medicine_name.toLowerCase().includes(searchTerm) ||
        item.brand_name.toLowerCase().includes(searchTerm) ||
        item.batch_no.toLowerCase().includes(searchTerm) ||
        (item.location && item.location.toLowerCase().includes(searchTerm)) ||
        (item.note && item.note.toLowerCase().includes(searchTerm))
    );

    filteredData.forEach(item => {
        const row = `
            <tr>
                <td>${item.medicine_name}</td>
                <td>${item.brand_name}</td>
                <td>${item.batch_no}</td>
                <td>${formatDate(item.mgf_date)}</td>
                <td>${formatDate(item.exp_date)}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price}</td>
                <td>${item.location || 'N/A'}</td>
                <td>${item.note || '-'}</td>
                <td>
                    <div class="action-buttons">
                        <button class="edit-btn" onclick="editProduct(${item.id})">Edit</button>
                        <button class="delete-btn" onclick="deleteProduct(${item.id})">Delete</button>
                    </div>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Go back to dashboard
function goBack() {
    if (currentUser.accountType === 'owner') {
        window.location.href = 'owner-dashboard.html';
    } else if (currentUser.accountType === 'employee') {
        window.location.href = 'employee-dashboard.html';
    } else {
        window.location.href = 'index.html';
    }
}

// Logout
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('productModal');
    if (event.target === modal) {
        closeModal();
    }
}