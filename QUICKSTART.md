# Quick Start Guide

## Prerequisites
- Node.js v18+ installed
- MongoDB v5+ installed and running
- npm or yarn

## Setup in 3 Steps

### 1. Backend Setup (2 minutes)
```bash
cd backend
npm install
npx ts-node src/seed.ts
npm run dev
```

✅ Backend running at `http://localhost:5000`

### 2. Frontend Setup (2 minutes)
```bash
cd frontend
npm install
npm run dev
```

✅ Frontend running at `http://localhost:5173`

### 3. Login
Open `http://localhost:5173` and login with:
- **Email**: `admin@seller.com`
- **Password**: `password123`

## 🎉 You're Ready!

The platform includes:
- ✅ Pre-seeded data (5 items, 5 categories, admin user)
- ✅ All features working out of the box  
- ✅ Dark/light mode support
- ✅ Responsive design

## Troubleshooting

**MongoDB not starting?**
```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
```

**Port already in use?**
- Backend: Change port in `.env` → `PORT=5001`
- Frontend: Change port in `vite.config.ts` → `server.port: 3000`

**Dependencies failed to install?**
```bash
# Clear cache and retry
npm cache clean --force
npm install
```

## What to Try First

1. **Dashboard** - View sales statistics and low stock alerts
2. **Billing** - Create a test sale (items auto reduce from stock)
3. **Items** - Add new products with pricing
4. **Stock** - View inventory movement logs
5. **Settings** - Toggle dark mode 🌙

## Need Help?

Check the main [README.md](file:///E:/PROJECTS/seller%20managment/README.md) for:
- Complete API documentation
- Deployment guides
- Feature details
- Architecture overview

---

**Ready for production?** The system includes:
- JWT authentication
- Role-based access
- Transaction-safe operations
- Automatic profit calculation
- Low stock alerts
- Complete audit trails
