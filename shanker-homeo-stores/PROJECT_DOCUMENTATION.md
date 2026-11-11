# Shankar Homeo Stores - Project Documentation

---

## 1. Cover Page

### Project Title
**Shankar Homeo Stores - E-Commerce Platform**

### Team Number
**Team SHS-001**

### Project Type
**Web & Mobile E-Commerce Application**

### Student Details
- **Name:** [Student Name]
- **Roll Number:** [Roll Number]
- **Email:** [Student Email]

### Project Period
**Academic Year 2024-2025**

---

## 2. Project Overview & Objectives

### Abstract (100-150 words)
Shankar Homeo Stores is a comprehensive e-commerce platform designed specifically for homeopathic medicines and cosmetic products. The system addresses the growing need for digital pharmacy solutions by providing customers with an intuitive interface to browse products, place orders, and track deliveries. The platform includes role-based access for customers, employees, and owners, enabling efficient order management, inventory control, and payment processing. With support for multiple product images, OTP-based order verification, and both Cash on Delivery and UPI payment options, the system ensures a complete shopping experience. The project demonstrates modern web development practices using HTML, CSS, JavaScript, MySQL, and React Native for mobile compatibility.

### Problem Addressed
Traditional homeopathic and cosmetic stores face challenges in:
- Limited customer reach due to physical location constraints
- Manual inventory management and order processing
- Lack of real-time order tracking and status updates
- Inefficient payment collection and verification processes
- Difficulty in managing multiple user roles (customers, employees, owners)

### Main Objectives

1. **Develop a User-Friendly E-Commerce Interface**
   - Create an intuitive product browsing experience with category filtering
   - Implement search functionality for quick product discovery
   - Support multiple product images for better product visualization

2. **Implement Secure Order Management System**
   - Generate unique order IDs and OTP codes for order verification
   - Enable role-based order processing (customer placement, employee acceptance, owner oversight)
   - Track order status through defined stages: Placed → Ready → Completed

3. **Integrate Payment Solutions**
   - Support Cash on Delivery for traditional customers
   - Implement UPI payment integration with QR code generation
   - Use the specified UPI ID: shankarhomoeostores@okhdfcbank

4. **Create Role-Based Access Control**
   - Customer access for browsing, cart management, and order placement
   - Employee access for order acceptance, product management, and attendance tracking
   - Owner access for complete administrative control and employee approval

5. **Develop Mobile-Responsive Solution**
   - Ensure seamless experience across desktop and mobile devices
   - Implement dark mode and light mode themes for user preference
   - Add smooth animations for enhanced user experience

---

## 3. Technology Stack

### Frontend Technologies
- **HTML5** - Structure and markup
- **CSS3** - Styling with CSS variables for theming
- **JavaScript (ES6+)** - Client-side logic and interactivity
- **React Native** - Mobile application development
- **Expo** - React Native development toolkit

### Backend Technologies
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Web application framework for API development
- **RESTful API** - API architecture for client-server communication

### Database
- **MySQL 8.0** - Relational database for data persistence
- **MySQL2** - MySQL driver for Node.js

### Authentication & Security
- **JWT (JSON Web Tokens)** - Token-based authentication
- **bcrypt** - Password hashing for security
- **LocalStorage** - Client-side data storage (fallback mode)

### Development Tools
- **Git** - Version control
- **Visual Studio Code** - Code editor
- **Postman** - API testing
- **Chrome DevTools** - Browser debugging
- **Python SimpleHTTPServer** - Local web server

### APIs & Integrations
- **QR Code Generation API** - Dynamic UPI QR code creation
- **UPI Payment Integration** - Mobile payment processing
- **Image Placeholder Service** - Default product images

### UI/UX Features
- **CSS Animations** - Smooth transitions and interactions
- **Responsive Design** - Mobile-first approach
- **Dark/Light Mode** - Theme switching capability
- **Modern Medical Theme** - Professional teal color scheme (#00838f)

---

## 4. Features & Implementation

### Key Features

#### A. Product Management
- **Multi-Image Support**: Products can display multiple images with carousel navigation
- **Category Filtering**: Separate categories for Homeopathic and Cosmetic products
- **Search Functionality**: Real-time search across product names, brands, and categories
- **Inventory Tracking**: Real-time stock quantity management
- **Product Details**: Comprehensive information including batch number, manufacturing date, expiry date, location, and notes

#### B. Shopping Cart System
- **Add to Cart**: Easy product addition with quantity management
- **Cart Persistence**: Cart items saved in localStorage
- **Real-time Updates**: Automatic calculation of totals and quantities
- **Cart Management**: Edit quantities, remove items, clear cart

#### C. Order Management
- **Unique Order IDs**: Generated using timestamp format (ORD + timestamp)
- **OTP System**: 4-digit OTP generated for each order for secure pickup verification
- **Order Status Tracking**: Three-stage workflow:
  - **Placed**: Order submitted by customer
  - **Ready**: Order accepted by employee/owner, ready for pickup
  - **Completed**: OTP verified, order collected by customer
- **Order History**: Complete order tracking for customers and employees

#### D. Payment Integration
- **Cash on Delivery**: Traditional payment option with collection reminders
- **UPI Payment**: Online payment with QR code generation
- **UPI ID**: shankarhomoeostores@okhdfcbank
- **Payment Status Tracking**: Monitor payment completion status

#### E. User Authentication & Authorization
- **Role-Based Access Control**:
  - **Customer**: Browse products, place orders, track orders
  - **Employee**: Accept orders, manage inventory, track attendance
  - **Owner**: Full administrative control, employee approval
- **JWT Authentication**: Secure token-based authentication
- **Registration System**: User account creation with email validation
- **Password Security**: Hashed password storage

#### F. Employee Management
- **Attendance Tracking**: Check-in/check-out system for employees
- **Order Processing**: Employee-specific order acceptance and completion
- **Product Management**: Add, edit, and delete products
- **Owner Approval**: Employee accounts require owner approval

#### G. UI/UX Enhancements
- **Dark/Light Mode**: Theme toggle with localStorage persistence
- **Smooth Animations**: Fade-in, slide-in, scale effects, hover animations
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Professional Medical Theme**: Teal color scheme for healthcare industry alignment

### Application Workflow

#### Customer Workflow:
1. **Browse Products**: View products with images, prices, and details
2. **Add to Cart**: Select products and add to shopping cart
3. **Select Payment**: Choose between Cash on Delivery or UPI payment
4. **Place Order**: Submit order with unique Order ID and OTP
5. **Track Order**: Monitor order status in "My Orders" section
6. **Complete Order**: Share OTP with employee for order collection

#### Employee Workflow:
1. **Login**: Access employee dashboard
2. **View Orders**: See pending orders from customers
3. **Accept Orders**: Mark orders as ready for pickup
4. **Complete Orders**: Verify OTP and mark orders as completed
5. **Manage Inventory**: Add, edit, or delete products
6. **Track Attendance**: Record check-in/check-out times

#### Owner Workflow:
1. **Administrative Access**: Full control over all system features
2. **Employee Management**: Approve employee accounts, view employee activity
3. **Order Oversight**: Monitor all orders and employee performance
4. **Product Management**: Complete inventory control
5. **System Configuration**: Manage system settings and user roles

### Major Functions Explanation

#### A. Product Display Function
```javascript
function displayProducts(products) {
    // Creates product cards with images and details
    // Implements staggered animation for smooth loading
    // Supports category filtering and search
    // Handles multi-image carousel display
}
```

#### B. Order Placement Function
```javascript
async function placeOrder() {
    // Generates unique Order ID (ORD + timestamp)
    // Creates 4-digit OTP for order verification
    // Stores order with customer details and items
    // Calculates total amount and payment method
    // Clears cart after successful order placement
}
```

#### C. Theme Toggle Function
```javascript
function toggleTheme() {
    // Switches between dark and light mode
    // Updates CSS variables for color scheme
    // Saves preference in localStorage
    // Applies theme across all pages
}
```

#### D. API Configuration Function
```javascript
const API_CONFIG = {
    // Auto-detects local vs deployed environment
    // Provides fallback to localStorage when backend unavailable
    // Supports custom API URL configuration
    // Ensures seamless development and deployment
}
```

#### E. Authentication Function
```javascript
async function handleLogin() {
    // Validates user credentials
    // Generates JWT token for authenticated sessions
    // Redirects based on user role (customer/employee/owner)
    // Implements localStorage fallback for offline mode
}
```

---

## 5. Screenshots & Results

### Screenshot 1: Product Browsing Page
**Description**: The main product browsing interface showing the medical-themed layout with teal color scheme. Customers can view products with images, filter by category (Homeopathic/Cosmetic), search for specific items, and add products to cart. The page demonstrates the responsive design and smooth animations when products load.

### Screenshot 2: Shopping Cart with Payment Options
**Description**: The shopping cart page displaying selected items with quantity controls. Shows the payment method selection with "Cash at Delivery" and "Pay Online Now" options. When UPI payment is selected, a QR code is generated using the UPI ID shankarhomoeostores@okhdfcbank for easy mobile payment.

### Screenshot 3: Order Confirmation with OTP
**Description**: The order confirmation page showing the successfully placed order with unique Order ID (e.g., ORD12345678) and 4-digit OTP prominently displayed. The page includes order details, payment method, and navigation options to view order history or continue shopping.

### Screenshot 4: Customer "My Orders" Page
**Description**: The customer order tracking page showing all orders with their current status (Placed, Ready, Completed). Each order card displays the Order ID, OTP, items, total amount, payment method, and status. The status badges are color-coded for easy identification.

### Screenshot 5: Employee Order Management Dashboard
**Description**: The employee dashboard for order management showing pending orders that need acceptance. Employees can view order details, accept orders to mark them as ready, and complete orders by verifying the customer's OTP. The interface also provides access to product management and attendance tracking.

### Screenshot 6: Dark Mode Implementation
**Description**: The website in dark mode showing the dark blue gradient background, dark gray cards, and light text. The theme toggle button (☀️) allows users to switch between light and dark modes, with the preference saved in localStorage for consistent experience across sessions.

---

## 6. AI Usage & Contributions

### AI Tools Used

#### Devin AI Assistant
**Purpose**: Used throughout the development process for:
- Code generation and optimization
- Debugging and error resolution
- Implementation of complex features (OTP system, payment integration)
- UI/UX improvements and animation implementation
- Database schema design and optimization
- API development and testing

#### AI-Specific Contributions:
1. **Dark/Light Mode Implementation**: Generated CSS variables and JavaScript logic for theme switching
2. **Animation System**: Created comprehensive CSS animations for enhanced user experience
3. **API Configuration**: Developed environment detection for local and deployed environments
4. **Fallback System**: Implemented localStorage backup when backend is unavailable
5. **UPI Integration**: Configured UPI payment integration with QR code generation
6. **OTP System**: Developed secure OTP generation and verification logic

### Team Member Contributions

#### Student Name: [Student Name]
**Roll Number: [Roll Number]**

**Contributions:**
- **Project Planning**: Defined project scope, objectives, and technology stack
- **Database Design**: Created MySQL schema for users, products, orders, and attendance
- **Backend Development**: Built Express.js API with authentication and CRUD operations
- **Frontend Development**: Implemented HTML/CSS/JavaScript for web interface
- **Mobile Development**: Created React Native application with Expo
- **Integration**: Connected frontend and backend with RESTful API
- **Testing**: Performed comprehensive testing of all features
- **Documentation**: Created project documentation and user guides

**Specific Features Implemented:**
- Product management with multi-image support
- Shopping cart and order placement system
- OTP-based order verification
- Payment method integration (Cash/UPI)
- Role-based access control
- Dark/Light mode theme switching
- Smooth animations and transitions
- Responsive design for mobile devices

**Challenges Overcome:**
- Resolved backend connection issues for deployed environment
- Implemented localStorage fallback for offline functionality
- Fixed UPI ID configuration across web and mobile versions
- Optimized animation performance for smooth user experience
- Ensured data persistence across page refreshes

---

## Conclusion

The Shankar Homeo Stores project successfully demonstrates the development of a comprehensive e-commerce platform for homeopathic and cosmetic products. The system provides a complete solution for digital pharmacy operations with features like product browsing, order management, payment integration, and role-based access control. The implementation of modern web technologies, responsive design, and smooth animations ensures an excellent user experience across all devices. The project showcases practical application of full-stack development skills and problem-solving abilities in creating a real-world e-commerce solution.

---

## References

- **Node.js Documentation**: https://nodejs.org/docs/
- **Express.js Framework**: https://expressjs.com/
- **MySQL Database**: https://dev.mysql.com/doc/
- **React Native**: https://reactnative.dev/
- **UPI Payment Integration**: NPCI UPI Documentation
- **CSS Animations**: MDN Web Docs - CSS Animations

---

**Project Completion Date**: [Date]
**Version**: 1.0.0
**Status**: Completed and Deployed