// Account reset script: deletes all accounts and configures the single owner account
function resetAllAccountsToOwner() {
    const owner = {
        id: 1,
        name: 'J D Shankar',
        email: 'shankarhomeostores@gmail.com',
        mobile: '9844874544',
        password: 'SHS#123',
        accountType: 'owner',
        type: 'owner',
        roles: ['owner', 'customer', 'employee'],
        approved: true,
        is_approved: true,
        createdAt: new Date().toISOString()
    };

    localStorage.setItem('users', JSON.stringify([owner]));
    localStorage.removeItem('shankerUsers');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');

    console.log('✓ All accounts deleted successfully.');
    console.log('✓ Owner account created:');
    console.log('  Name: ' + owner.name);
    console.log('  Email: ' + owner.email);
    console.log('  Password: ' + owner.password);
}

// Execute reset
resetAllAccountsToOwner();