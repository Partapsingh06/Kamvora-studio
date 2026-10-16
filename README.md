# Kamvora Studio – Premium Art & Craft E-Commerce Platform

> **"Art That Speaks. Crafts That Tell Stories."**  
> A full-stack MERN artisanal e-commerce web application created for **Kamvora Studio** — specializing in slow handcrafted embroidery, ocean resin art, fabric paintings, bespoke charcoal portraits, personalized lamps, and custom keepsakes.

---

## 1. Brand Information & Contact

- **Brand Name:** Kamvora Studio
- **Founder & Lead Artisan:** Komal Kang
- **Business Type:** Handmade Art, Craft, Customized Gifts, and Creative Keepsakes
- **Official Email:** [Kamvorastudio@gmail.com](mailto:Kamvorastudio@gmail.com)
- **Direct Phone:** [+91 99150-88706](tel:+919915088706)
- **Instagram:** [@iamkomalkang](https://www.instagram.com/iamkomalkang?igsh=MWh4aWlhNzU1emd5cQ==)
- **Studio Address:** Shop Number 399, Janta Market, Mohali, Punjab, India

---

## 2. Technology Stack

### Frontend
- **Framework:** React.js 19 with Vite 8
- **Styling:** Tailwind CSS with custom editorial luxury design system
- **Routing:** React Router DOM (v7)
- **Icons:** Lucide React + Bespoke SVGs (Instagram, Logo Emblem)
- **State Management:** React Context API (`AuthContext`, `CartContext`, `WishlistContext`, `ToastContext`)
- **API Client:** Axios with auto-attached JWT bearer tokens
- **Typography:** *Cormorant Garamond* (Editorial Serif), *Playfair Display*, and *Plus Jakarta Sans* (Modern Clean UI)

### Backend
- **Runtime:** Node.js (v22+)
- **Framework:** Express.js
- **Database:** MongoDB Atlas with Mongoose (with hybrid resilient local JSON fallback)
- **Authentication:** JWT (JSON Web Tokens) with `bcryptjs` password hashing
- **File Uploads & Storage:** Multer + Cloudinary SDK for permanent CDN image hosting
- **Payment Gateway:** Razorpay SDK (order creation + backend HMAC-SHA256 signature verification) + Cash on Delivery (COD)
- **Security:** CORS, input validation, role-based authorization middleware (`protect`, `adminOnly`)

---

## 3. Key Features & Implementation

### A. Customer Storefront
1. **Announcement Bar:** Top announcement bar showing dynamic offers and free delivery progress.
2. **Sticky Navigation:** Artistic logo emblem, mega-category dropdown, search bar overlay, wishlist counter, live cart badge, and customer account menu.
3. **Hero Section:** High-impact artisanal showcase with primary call-to-actions ("Explore Collection", "Customize Your Gift").
4. **Featured Categories:** 8 handcrafted categories:
   - Handmade Embroidery
   - Resin Art
   - Fabric Painting
   - Custom Portraits
   - Handmade Gifts
   - Customized Gifts
   - Home Decor
   - Personalized Accessories
5. **Dynamic Catalog & Shop:**
   - Real-time search by keyword and description
   - Category filtering with active pills
   - Interactive price range slider
   - In-stock availability toggle
   - Multi-option sorting (Newest, Price: Low to High, Price: High to Low)
6. **Product Detail Pages:**
   - Multi-thumbnail photo gallery
   - Artisan craft tags and discount calculations
   - Custom text / engraving input field saved directly to cart items
   - Stock counter and quantity selectors
   - Detailed craft specifications accordion
   - Related products carousel
7. **Quick View Modal:** Instant preview modal directly from any product card without leaving the page.
8. **Shopping Cart & Checkout:**
   - Persistent cart state
   - Instant promo code verification (`WELCOME10`, `ARTLOVER`, `STUDIO20`)
   - Free shipping calculation threshold (Orders above ₹1,999)
   - Checkout with full shipping details, pincode validation, and order notes
   - **Payment Methods:**
     - Razorpay Online Gateway (UPI, Cards, Netbanking) with backend HMAC signature verification
     - Cash on Delivery (COD)
9. **Interactive Order Tracking (`/order-tracking`):**
   - 5-stage production and delivery tracker (Confirmed &rarr; In Production &rarr; Handcrafted & Packed &rarr; Dispatched &rarr; Delivered)
   - Order summary, courier tracking, and customer shipping address lookup
10. **Custom Order Request Commission System (`/custom-order`):**
    - Specialized commission intake form for custom portraits, wedding hoops, and keepsake lamps
    - File upload preview for reference photos (uploaded to Cloudinary)
    - Generates unique reference ID (e.g., `KAM-CUST-545396-9889`)
    - Instant submission saved directly to database for admin review
11. **Instagram Community Showcase:**
    - Live feed collage linking directly to [@iamkomalkang](https://www.instagram.com/iamkomalkang?igsh=MWh4aWlhNzU1emd5cQ==)
12. **Newsletter:**
    - Working email subscription with backend validation and duplicate prevention

### B. Admin Management Portal (`/admin`)
- **Dashboard Overview:** Live business metrics (Total Sales Revenue, Orders Count, Product Catalog Size, Pending Custom Inquiries, Recent Transactions).
- **Product Management (`/admin/products`):** Create, update, toggle active status, and delete products with image upload preview and pricing controls.
- **Category Management (`/admin/categories`):** Add, edit, or delete categories with safety checks to prevent orphan products.
- **Order Management (`/admin/orders`):** View all customer orders, filter by status, update delivery progress (`Confirmed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`), and add courier tracking numbers.
- **Custom Order Requests (`/admin/custom-requests`):** Review incoming custom inquiries, inspect reference photos, update inquiry status, and view customer contact info.
- **Coupon Management (`/admin/coupons`):** Create discount codes with percentage or flat amount discounts, minimum spend requirements, and expiry dates.
- **Store Settings (`/admin/settings`):** Update live announcement banner text, phone, email, studio address, social handles, and shipping policies.

---

## 4. Default Demo Accounts

For immediate evaluation and testing, the application comes pre-seeded with two accounts:

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@kamvorastudio.com` | `KamvoraAdmin@2026` |
| **Customer** | `aarav.sharma@example.com` | `Customer@2026` |

> *Tip: The Login page includes one-click "Demo Admin" and "Demo Customer" quick-fill buttons.*

---

## 5. Active Discount Coupons

Test any of these coupons in the shopping cart:
- `WELCOME10`: 10% OFF on all orders
- `ARTLOVER`: 15% OFF on orders over ₹1,500
- `STUDIO20`: 20% OFF on orders over ₹3,000

---

## 6. Project Structure

```
Kamvora Studio/
├── client/                      # React 19 + Vite Frontend
│   ├── public/
│   │   ├── favicon.svg          # Brand favicon emblem
│   │   ├── robots.txt           # SEO robots directives
│   │   └── sitemap.xml          # XML search engine sitemap
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Navbar.jsx       # Header navigation with search & cart
│   │   │   ├── Footer.jsx       # Brand footer with shop info & links
│   │   │   ├── AnnouncementBar.jsx # Announcement strip
│   │   │   ├── ProductCard.jsx  # Product card with hover effects
│   │   │   ├── QuickViewModal.jsx # Quick view preview modal
│   │   │   ├── AdminLayout.jsx  # Admin portal sidebar & shell
│   │   │   └── icons/           # Custom SVG icons (Instagram, etc.)
│   │   ├── context/             # Global state providers
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   ├── WishlistContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── pages/               # Application routes
│   │   │   ├── Home.jsx         # Artisanal storefront home
│   │   │   ├── Shop.jsx         # Product catalog with filters
│   │   │   ├── ProductDetails.jsx # Detailed product page
│   │   │   ├── CategoryProducts.jsx # Category-specific catalog
│   │   │   ├── CustomOrder.jsx  # Custom commission intake form
│   │   │   ├── Cart.jsx         # Cart with coupon redemption
│   │   │   ├── Checkout.jsx     # Checkout & payment processing
│   │   │   ├── OrderConfirmation.jsx # Post-order receipt
│   │   │   ├── OrderTracking.jsx # Order status tracker
│   │   │   ├── Wishlist.jsx     # Saved favorites
│   │   │   ├── Account.jsx      # Customer profile & orders
│   │   │   ├── Login.jsx & Register.jsx # Authentication
│   │   │   ├── About.jsx        # Studio storytelling & Komal Kang bio
│   │   │   ├── Contact.jsx      # Contact form & Mohali studio map
│   │   │   ├── FAQ.jsx          # Frequently asked questions
│   │   │   ├── LegalPages.jsx   # Privacy, Terms, Shipping, Refund policies
│   │   │   ├── NotFound.jsx     # 404 page
│   │   │   └── admin/           # Admin dashboard pages
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminProducts.jsx
│   │   │       ├── AdminCategories.jsx
│   │   │       ├── AdminOrders.jsx
│   │   │       ├── AdminCustomRequests.jsx
│   │   │       ├── AdminCustomers.jsx
│   │   │       ├── AdminCoupons.jsx
│   │   │       └── AdminSettings.jsx
│   │   ├── utils/
│   │   │   ├── api.js           # Axios instance with interceptors
│   │   │   └── currency.js      # INR currency formatter
│   │   ├── App.jsx              # Application router
│   │   ├── main.jsx             # React DOM entry point
│   │   └── index.css            # Bespoke styling and typography
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Node.js + Express Backend
│   ├── data/
│   │   └── kamvora_db.json      # Resilient local database persistence
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js            # MongoDB Atlas connection
│   │   │   ├── dbAdapter.js     # Hybrid Atlas/JSON storage adapter
│   │   │   ├── dataStore.js     # Resilient data persistence engine
│   │   │   ├── cloudinary.js    # Permanent Cloudinary integration
│   │   │   └── razorpay.js      # Razorpay payment & signature verification
│   │   ├── controllers/         # Request handling logic
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── categoryController.js
│   │   │   ├── orderController.js
│   │   │   ├── customOrderController.js
│   │   │   ├── couponController.js
│   │   │   ├── reviewController.js
│   │   │   ├── newsletterController.js
│   │   │   └── settingsController.js
│   │   ├── middleware/
│   │   │   ├── auth.js          # JWT verification & admin guard
│   │   │   ├── upload.js        # Multer image upload parser
│   │   │   └── errorHandler.js  # Global error handling
│   │   ├── models/              # Mongoose data schemas
│   │   │   ├── User.js
│   │   │   ├── Category.js
│   │   │   ├── Product.js
│   │   │   ├── Order.js
│   │   │   ├── CustomOrderRequest.js
│   │   │   ├── Coupon.js
│   │   │   ├── Review.js
│   │   │   ├── NewsletterSubscriber.js
│   │   │   └── StoreSettings.js
│   │   ├── routes/              # Express API endpoints
│   │   └── server.js            # Express server entry point
│   ├── .env.example
│   └── package.json
│
├── .env.example                 # Root environment variables template
└── README.md                    # Project documentation
```

---

## 7. Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- [Git](https://git-scm.com/)

### Step 1: Install Dependencies
Open a terminal in the project directory:

```bash
# 1. Install backend dependencies
cd server
npm install

# 2. Install frontend dependencies
cd ../client
npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `server/.env`:
```bash
cd ../server
cp .env.example .env
```
Fill in the credentials as described below:
- `MONGODB_URI`: Your MongoDB Atlas connection URI (optional; if left blank or unreachable, the server automatically saves to `server/data/kamvora_db.json`).
- `CLOUDINARY_*`: Cloudinary cloud name, API key, and API secret (optional; if omitted, uploads are safely stored in `server/uploads/`).
- `RAZORPAY_*`: Razorpay Key ID and Secret (optional; test mode works out of the box).

### Step 3: Run the Servers
Open two terminal windows:

**Terminal 1 (Backend Server):**
```bash
cd server
npm run dev
# Starts backend on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
# Starts Vite dev server on http://localhost:5173
```

Visit **`http://localhost:5173`** in your browser.

---

## 8. Production Deployment Guide

### A. Deploy Backend to Render
1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your Git repository.
3. Set the Root Directory to `server`.
4. Configure:
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node src/server.js`
5. In the **Environment Variables** tab, add:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A long, secure random string
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`

### B. Deploy Frontend to Vercel
1. Import your Git repository on [Vercel](https://vercel.com).
2. Set the Root Directory to `client`.
3. Framework Preset: `Vite`.
4. Configure Build Settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add Environment Variables:
   - `VITE_API_URL`: Your deployed Render backend URL (e.g. `https://kamvora-studio-api.onrender.com/api`)
   - `VITE_RAZORPAY_KEY_ID`: Your Razorpay Key ID

### C. MongoDB Atlas Setup
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a database user with read/write privileges.
3. In Network Access, add `0.0.0.0/0` (allow access from anywhere) so Render can connect.
4. Copy the connection string into your `MONGODB_URI` environment variable.

### D. Cloudinary Setup
1. Create an account on [Cloudinary](https://cloudinary.com).
2. From your Cloudinary Dashboard, copy the **Cloud Name**, **API Key**, and **API Secret**.
3. Add them to your backend `.env` on Render to enable permanent CDN hosting for products and custom order uploads.

---

## 9. Verification & Testing Checklist

- [x] Responsive layout tested on desktop, tablet, and mobile viewports.
- [x] Category navigation opens filtered collections with active category pills.
- [x] Search, price slider, and sorting update catalog in real-time.
- [x] Product detail pages support multi-image gallery and custom gift engraving notes.
- [x] Shopping cart verifies stock, applies coupon codes (`WELCOME10`), and calculates free delivery thresholds.
- [x] Checkout creates orders with unique tracking IDs (`KAM-ORD-...`) with Cash on Delivery and Razorpay.
- [x] Order tracking page displays 5-stage live status timeline.
- [x] Custom Order Commission form accepts bespoke requests and generates reference numbers (`KAM-CUST-...`).
- [x] Admin dashboard securely protected with JWT authentication and admin role checks.
- [x] Admin portal can manage products, categories, orders, custom requests, coupons, and store settings.
- [x] Social links connect to authentic Kamvora Studio Instagram (`@iamkomalkang`) and Mohali studio address.

---

© 2026 Kamvora Studio. All rights reserved. Handcrafted with love in Mohali, Punjab.
