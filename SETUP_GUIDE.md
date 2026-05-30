# CollegeKart E-commerce Setup Guide

Complete guide to set up and run the CollegeKart e-commerce platform on your local machine.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [MongoDB Setup](#mongodb-setup)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Stripe Payment Setup](#stripe-payment-setup)
6. [Running the Application](#running-the-application)
7. [Troubleshooting](#troubleshooting)
8. [Admin Account](#admin-account)

---

## Prerequisites

Make sure you have the following installed on your system:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** (v7.0 or higher)
- **Git** (for cloning)

Check installations:
```bash
node --version
npm --version
```

---

## MongoDB Setup

### 1. Install MongoDB

```bash
# Import MongoDB GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg

# Add MongoDB repository (Ubuntu/Debian)
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package database
sudo apt update

# Install MongoDB
sudo apt install -y mongodb-org
```

### 2. Start MongoDB Service

```bash
# Start MongoDB
sudo systemctl start mongod

# Enable MongoDB to start on boot
sudo systemctl enable mongod

# Verify MongoDB is running
sudo systemctl status mongod
```

---

## Backend Setup

### 1. Navigate to Project Root

```bash
cd /path/to/Project_E-commerce
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create/verify the `.env` file in the project root:

```env
PORT=4000
NODE_ENV=DEVELOPMENT
FRONTEND_URL=http://localhost:3000

DB_LOCAL_URI=mongodb://127.0.0.1:27017/college_cart
DB_URI=mongodb://127.0.0.1:27017/college_cart

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_TIME=7d
COOKIE_EXPIRES_TIME=7

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM_EMAIL=your_email@gmail.com
SMTP_FROM_NAME=CollegeKart

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### 4. Seed Database with Sample Products

```bash
npm run seeder
```

This creates:
- An admin user (email: `admin@shopit.com`, password: `123456`)
- 9 sample products

### 5. Start Backend Server

```bash
# Development mode with auto-restart
npm run dev

# OR Production mode
npm run prod

# OR Simple start
npm start
```

Backend will run on **http://localhost:4000**

---

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Start Frontend Development Server

```bash
npm start
```

Frontend will run on **http://localhost:3000**

The browser should automatically open. If not, navigate to http://localhost:3000

---

## Stripe Payment Setup

### 1. Create Stripe Account

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/register)
2. Sign up for a free account
3. Activate your account

### 2. Get API Keys

1. Navigate to **Developers** → **API keys**
2. Copy your **Secret key** (starts with `sk_test_`)
3. Update `STRIPE_SECRET_KEY` in your `.env` file

### 3. Install Stripe CLI

```bash
# Add Stripe repository
curl -s https://packages.stripe.dev/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg

echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.dev/stripe-cli-debian-local stable main" | sudo tee /etc/apt/sources.list.d/stripe.list

# Update and install
sudo apt update
sudo apt install stripe
```

### 4. Login to Stripe CLI

```bash
stripe login
```

This will open your browser to authorize the CLI.

### 5. Forward Webhooks to Local Server

**IMPORTANT:** Open a **NEW TERMINAL** and run:

```bash
stripe listen --forward-to http://localhost:4000/api/webhook
```

**Expected output:**
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx (^C to quit)
```

### 6. Update Webhook Secret

1. Copy the `whsec_...` value from the Stripe CLI output
2. Update `STRIPE_WEBHOOK_SECRET` in your `.env` file
3. Restart your backend server

**Keep the `stripe listen` command running while testing payments!**

---

## Running the Application

### Required Terminals:

You need **3 terminals** running simultaneously:

#### Terminal 1: Backend
```bash
cd /path/to/Project_E-commerce
npm start
```

#### Terminal 2: Frontend
```bash
cd /path/to/Project_E-commerce/frontend
npm start
```

#### Terminal 3: Stripe Webhook Forwarding
```bash
stripe listen --forward-to http://localhost:4000/api/webhook
```

### Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000/api/v1

---

## Troubleshooting

### Issue: "Cannot GET /api/v1"
**Solution:** This is normal. You need to access specific endpoints like `/api/v1/products`

### Issue: Port 4000 already in use
**Solution:**
```bash
# Kill the process using port 4000
lsof -ti:4000 | xargs kill -9

# Then restart backend
npm start
```

### Issue: MongoDB connection refused
**Solution:**
```bash
# Start MongoDB
sudo systemctl start mongod

# Check status
sudo systemctl status mongod
```

### Issue: No products showing on homepage
**Solution:**
```bash
# Run the seeder
npm run seeder
```

### Issue: Orders not showing after payment
**Solution:**
- Ensure `stripe listen` is running
- Verify `STRIPE_WEBHOOK_SECRET` matches the one from `stripe listen`
- Restart backend after updating webhook secret

### Issue: Frontend compilation warnings (react-datepicker source maps)
**Solution:** These are harmless warnings and don't affect functionality. You can ignore them.

### Issue: Case-sensitive import errors (Linux)
**Solution:** File paths are case-sensitive on Linux. Make sure imports match exact filenames:
- `APIFilters.js` not `apiFilters.js`
- `Backend/` not `backend/`

---

## Admin Account

After running the seeder, you can login as admin:

- **Email:** admin@shopit.com
- **Password:** 123456

**Admin privileges:**
- Add/Edit/Delete products
- View all orders
- Process orders
- View sales analytics

---

## Project Structure

```
Project_E-commerce/
├── Backend/
│   ├── app.js                 # Main application file
│   ├── config/
│   │   └── dbConnect.js       # Database configuration
│   ├── controllers/           # Route controllers
│   ├── middlewares/           # Express middlewares
│   ├── models/                # Mongoose models
│   ├── routes/                # API routes
│   ├── seeder/                # Database seeder
│   └── utils/                 # Utility functions
├── frontend/
│   ├── public/                # Static files
│   └── src/
│       ├── components/        # React components
│       ├── redux/             # Redux store & API
│       └── helpers/           # Helper functions
├── .env                       # Environment variables
├── package.json               # Backend dependencies
└── README.md                  # This file
```

---

## API Endpoints

### Products
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/:id` - Get single product

### Authentication
- `POST /api/v1/register` - Register user
- `POST /api/v1/login` - Login user
- `POST /api/v1/logout` - Logout user

### Orders
- `POST /api/v1/orders/new` - Create order
- `GET /api/v1/me/orders` - Get user orders
- `GET /api/v1/orders/:id` - Get order details

### Payment
- `POST /api/v1/payment/checkout_session` - Create Stripe session
- `POST /api/webhook` - Stripe webhook handler

---

## Scripts Reference

### Backend Scripts
```bash
npm start          # Start backend server
npm run dev        # Start with nodemon (auto-restart)
npm run prod       # Start in production mode
npm run seeder     # Seed database with sample data
```

### Frontend Scripts
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
```

---

## Support

For issues or questions:
- Check the [Troubleshooting](#troubleshooting) section
- Review MongoDB logs: `sudo journalctl -u mongod`
- Review backend logs in the terminal
- Check browser console (F12) for frontend errors

---

## Notes

1. **Always run backend before frontend**
2. **Keep all 3 terminals running** (backend, frontend, stripe)
3. **Use port 3000** for accessing the application (not 4000)
4. **Test payments** use Stripe test cards:
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
5. **Database is local** - data persists between restarts

---

**Happy Coding! 🎉**
