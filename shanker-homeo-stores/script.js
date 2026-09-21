function showInfo() {
    document.getElementById('infoSection').style.display = 'block';
}

function hideInfo() {
    document.getElementById('infoSection').style.display = 'none';
}

// Check login state and update navigation
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const myOrdersBtn = document.getElementById('myOrdersBtn');

    if (currentUser && myOrdersBtn) {
        myOrdersBtn.style.display = 'inline-block';
    }
});