// Test employee setup script - run this in browser console to create test employees
function createTestEmployees() {
    let users = JSON.parse(localStorage.getItem('shankerUsers')) || [];

    // Create test employees if they don't exist
    const testEmployees = [
        {
            name: 'Test Employee 1',
            email: 'employee1@test.com',
            mobile: '9876543210',
            password: 'emp123',
            accountType: 'employee',
            approved: false,
            rejected: false,
            createdAt: new Date().toISOString()
        },
        {
            name: 'Test Employee 2',
            email: 'employee2@test.com',
            mobile: '9876543211',
            password: 'emp123',
            accountType: 'employee',
            approved: true,
            rejected: false,
            createdAt: new Date().toISOString()
        }
    ];

    testEmployees.forEach(testEmp => {
        if (!users.find(u => u.email === testEmp.email)) {
            users.push(testEmp);
            console.log(`Created test employee: ${testEmp.email}`);
        }
    });

    localStorage.setItem('shankerUsers', JSON.stringify(users));
    console.log('Test employees setup complete');
    console.log('Total users:', users.length);
    console.log('Employees:', users.filter(u => u.accountType === 'employee'));
}

// Run the function
createTestEmployees();