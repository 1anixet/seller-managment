# Seller Management Platform

A comprehensive full-stack SaaS platform for cafés, retail shops, and hall/event sellers to manage inventory, billing, stock, and analytics in one unified system.

## 🚀 Features

### Core Features
- **Dashboard** - Real-time sales analytics, profit tracking, and low stock alerts
- **Item Management** - Add, edit, delete items with image support and category management
- **POS/Billing** - Fast checkout with cart management, multiple payment methods
- **Stock Management** - Track inventory movements, refill stock, adjust quantities
- **Sales History** - View all transactions with detailed analytics
- **User Management** - Role-based access control (Owner, Manager, Staff, Cashier)
- **Dark/Light Mode** - Beautiful UI with theme support

### Advanced Features
- Transaction-safe operations with MongoDB transactions
- Automatic profit margin calculation
- Low stock alerts with severity levels
- Real-time inventory updates
- Comprehensive audit logs
- Multi-branch support (ready)
- RESTful API architecture

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js + Express
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, bcrypt
- **Validation**: express-validator
- **File Upload**: Multer

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v7
- **State Management**: Redux Toolkit
- **Styling**: TailwindCSS v4
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

## 📁 Project Structure

```
seller-management/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── models/         # Mongoose models
│   │   ├── controllers/    # Route controllers
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helper functions
│   │   ├── server.ts       # Main server file
│   │   └── seed.ts         # Database seeding
│   ├── uploads/            # File uploads directory
│   ├── .env                # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── api/            # API client & services
    │   ├── components/     # Reusable components
    │   ├── layouts/        # Layout components
    │   ├── pages/          # Page components
    │   ├── store/          # Redux store & slices
    │   ├── types/          # TypeScript types
    │   ├── utils/          # Helper functions
    │   ├── App.tsx         # Main app component
    │   └── main.tsx        # Entry point
    ├── package.json
    └── vite.config.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd "E:\PROJECTS\seller managment"
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file (already created)
   # Update MongoDB URI if needed in .env
   
   # Seed the database with sample data
   npx ts-node src/seed.ts
   
   # Start development server
   npm run dev
   ```

   Backend will run at `http://localhost:5000`

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Start development server
   npm run dev
   ```

   Frontend will run at `http://localhost:5173`

## 🔑 Demo Credentials

```
Email: admin@seller.com
Password: password123
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "staff",
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+91 9876543210"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@seller.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <access_token>
```

## 🚀 Deployment

### Backend Deployment

#### Option 1: VPS (DigitalOcean, AWS EC2)
```bash
# Install Node.js and MongoDB on server
# Clone repository
# Install PM2 for process management
npm install -g pm2

# Build TypeScript
npm run build

# Start with PM2
pm2 start dist/server.js --name seller-backend

# Setup Nginx as reverse proxy
# Configure SSL with Let's Encrypt
```

#### Option 2: Platform as a Service (Railway, Render)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Frontend Deployment

#### Build for Production
```bash
cd frontend
npm run build
```

Deploy `dist/` folder to:
- Vercel
- Netlify
- Cloudflare Pages
- AWS S3 + CloudFront

## 📈 Scaling Strategy

1. **Horizontal Scaling**
   - Load balancer (Nginx) for multiple backend instances
   - Redis for session management and caching
   - MongoDB replica sets for high availability

2. **Vertical Scaling**
   - Increase server resources (CPU, RAM)
   - Optimize database queries and indexes
   - Use CDN for static assets

3. **Database Optimization**
   - Implement data archiving for old records
   - Monitor slow queries with MongoDB Atlas
   - Use aggregation pipelines efficiently

## 📝 License

This project is licensed under the MIT License.
