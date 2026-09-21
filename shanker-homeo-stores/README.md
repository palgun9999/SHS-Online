# Shankar Homeo Stores Website

A comprehensive homeopathic retail store management system with employee and customer portals.

## Features

### Landing Page
- Welcome message for Shankar Homeo Stores
- Information button with details about homeopathy
- Login button in the top right corner
- Professional purple gradient design

### User Registration & Login
- **Account Creation**: Requires both mobile number and email verification for all user types
- **User Types**:
  - Owner registration (auto-approved, requires email & mobile verification)
  - Employee registration (requires owner approval, email & mobile verification)
  - Customer registration (auto-approved, email & mobile verification)
- **Multi-step Verification**:
  1. Basic information (name, email, mobile, password)
  2. Email verification code
  3. Mobile verification code
  4. User type selection (Owner/Employee/Customer)

### Employee Dashboard
- **Stock Management**: Separate view and edit options
  - **View Stock**: Read-only access to all homeopathic products with:
    - Medicine name, brand name, batch number
    - Manufacturing and expiry dates
    - Current quantity and price
    - Stock status (In Stock, Low Stock, Out of Stock)
    - Expiry status (Good, Expiring Soon, Expired)
  - **Edit Stock**: Full CRUD operations for stock management
    - Add new products with detailed information
    - Edit existing product details
    - Delete products from inventory
    - Search functionality
- **Attendance System**:
  - Check-in/Check-out functionality
  - Attendance report with date, time, and hours worked
  - Monthly attendance statistics
- **Statistics Overview**:
  - Total products
  - Low stock items
  - Days present this month

### Owner Dashboard
- **Stock Management**: Separate view and edit options (same as employee)
  - **View Stock**: Read-only access to inventory with search and statistics
  - **Edit Stock**: Full CRUD operations for stock management
- **Employee Approvals**:
  - View pending employee registrations
  - Approve or reject employee accounts
  - View registration details
- **Employee Management**:
  - View all registered employees
  - Check approval status
- **Statistics**:
  - Pending approvals count
  - Total employees
  - Approved employees
  - Total products
  - Low stock items

## How to Use

### For Testing (Demo Mode)

1. **Open the Website**:
   - Open `index.html` in a web browser

2. **Register as Owner**:
   - Click "Login" → "Create Account"
   - Fill in the registration form with owner details
   - **Note**: Verification codes will be shown in the browser console (F12) for demo purposes
   - Select "Owner" as user type
   - Owner account is auto-approved after verification

3. **Login as Owner**:
   - Use the owner credentials to login
   - Access the Owner Dashboard to manage employees

4. **Register as Employee**:
   - Click "Login" → "Create Account"
   - Fill in the registration form
   - Complete email and mobile verification
   - Select "Employee" as user type
   - Account will be created but requires approval

5. **Approve Employee**:
   - Login as Owner
   - Navigate to "Employee Approvals"
   - Click "Approve" for the pending employee

6. **Login as Employee**:
   - Use the approved employee credentials
   - Access stock details and attendance system

**Important Notes:**
- Only one owner account can be created
- Owner must complete email and mobile verification like other users
- Direct access to owner dashboard is no longer available - must login first

### File Structure

```
shanker-homeo-stores/
├── index.html              # Landing page
├── login.html              # Login and registration page
├── employee-dashboard.html # Employee portal
├── owner-dashboard.html    # Owner/admin portal
├── stock-view.html         # Stock viewing page
├── stock-edit.html         # Stock editing page
├── styles.css              # Global styles
├── script.js               # Landing page scripts
├── login.js                # Authentication logic
├── employee-dashboard.js   # Employee functionality
├── owner-dashboard.js      # Owner functionality
├── stock-view.js           # Stock viewing functionality
├── stock-edit.js           # Stock editing functionality
└── README.md              # This file
```

## Technical Details

- **Technology**: Pure HTML, CSS, and JavaScript
- **Storage**: Uses localStorage for data persistence
- **Design**: Responsive design with modern gradient styling
- **Browser Compatibility**: Works on all modern browsers

## Sample Data

The system includes sample homeopathic products with the following structure:
- **Medicine Name**: Name of the homeopathic medicine
- **Brand Name**: Manufacturer/Brand (e.g., Dr. Reckeweg, SBL, Schwabe)
- **Batch Number**: Unique batch identifier
- **Manufacturing Date**: Date of manufacture
- **Expiry Date**: Product expiry date
- **Quantity**: Current stock quantity
- **Price**: Selling price in INR

Sample products include:
- Arnica Montana by Dr. Reckeweg
- Nux Vomica by SBL
- Rhus Tox by Schwabe
- Bryonia by Dr. Reckeweg
- Belladonna by SBL
- Pulsatilla by Schwabe
- Silicea by Dr. Reckeweg
- Sulphur by SBL
- Calcarea Carb by Schwabe
- Lycopodium by Dr. Reckeweg

## Future Enhancements

- Customer dashboard and features
- Real email/SMS verification integration
- Backend database integration
- Advanced stock management features
- Sales and reporting analytics
- Mobile app version

## Notes

- This is a demonstration prototype using localStorage
- In production, a proper backend with database would be required
- Email/SMS verification would need integration with services like Twilio or SendGrid
- Owner account is now properly secured with authentication and verification
- Only one owner account is allowed per system