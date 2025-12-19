# E-commerce React Application

This is a basic e-commerce application built with React, React Router, and Redux Toolkit. It uses `json-server` to simulate a backend API based on the `db.json` file.

## Project Structure

The project follows the structure provided:

\`\`\`
assignment/
├── db.json
├── package.json
├── package-lock.json
├── README.md
├── public/
│   └── index.html
│   └── ... (favicon, etc.)
└── src/
    ├── App.js
    ├── App.css
    ├── index.js
    ├── index.css
    ├── components/
    │   ├── layout.jsx
    │   ├── Footer.jsx
    │   ├── Header.jsx
    │   ├── AboutUs.jsx
    │   ├── Services.jsx
    │   ├── products/
    │   │   ├── ProductList.jsx
    │   │   ├── ProductDetail.jsx
    │   │   ├── ProductForm.jsx
    │   ├── cart/
    │   │   ├── CartPage.jsx
    │   ├── checkout/
    │   │   ├── CheckoutPage.jsx
    │   ├── orders/
    │   │   ├── OrderHistory.jsx
    │   │   ├── OrderList.jsx
    │   ├── login/
    │   │   ├── LoginPage.jsx
    │   ├── register/
    │   │   ├── RegisterPage.jsx
    │   ├── users/
    │   │   ├── UserManagement.jsx
    │   ├── payment/
    │   │   ├── PaymentHistory.jsx
    │   └── 404.jsx
    ├── redux/
    │   ├── store.js
    │   └── slices/
    │       ├── productSlice.js
    │       ├── userSlice.js
    │       ├── cartSlice.js
    │       ├── orderSlice.js
    │       ├── paymentSlice.js
    └── service/
        └── api.js
\`\`\`

## Getting Started

### 1. Clone the repository (if applicable)

### 2. Install Dependencies

Navigate to the project directory and install the required packages:

\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. Start the JSON Server

In a separate terminal, start the mock API server using `db.json`:

\`\`\`bash
npm run server
# or
yarn server
\`\`\`
The server will run on `http://localhost:3001`.

### 4. Start the React Application

In another terminal, start the React development server:

\`\`\`bash
npm start
# or
yarn start
\`\`\`
The application will open in your browser at `http://localhost:3000`.

## Available Scripts

In the project directory, you can run:

*   `npm start`: Runs the app in development mode.
*   `npm run build`: Builds the app for production to the `build` folder.
*   `npm test`: Launches the test runner.
*   `npm run eject`: Removes the single build dependency from your project.
*   `npm run server`: Starts the JSON Server using `db.json`.

## Features Implemented (Basic Structure)

*   **Authentication:** Login and Register pages.
*   **Product Management:** List, Detail, and (Admin) Form for products.
*   **Shopping Cart:** Add, view, edit, remove items.
*   **Checkout:** Shipping details and payment methods (including VietQR placeholder).
*   **Order History:** User's past orders.
*   **Admin Panels:** User Management, All Payment History.
*   **Informational Pages:** About Us, Services.
*   **Global Layout:** Header and Footer.
*   **State Management:** Redux Toolkit for centralized state.
*   **API Integration:** Axios for fetching and manipulating data from `json-server`.

## Styling

This project uses basic CSS and inline styles for simplicity. For a production application, consider a CSS framework like Tailwind CSS or a component library.

## Important Notes

*   **Authentication:** The login/register functionality is currently client-side and uses mock data from `db.json`. For a real application, you would integrate with a secure backend authentication system.
*   **Payment:** The VietQR and other payment methods on the checkout page are placeholders. Real payment integration requires secure API calls to payment gateways.
*   **Admin Functionality:** Admin pages (`ProductForm`, `UserManagement`, `PaymentHistory`) are structured but require full backend integration and authorization logic.
# MERN-practice
