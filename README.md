![Banner](https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,16,45&animation=scaleIn&fontSize=50&fontColor=fff&height=250&section=header&text=IndiaPlay&desc=Premium%20Gaming%20Platform&descSize=20)

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-15+-336791?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-5.x-5A67D8?style=for-the-badge&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/Socket.io-4.x-010101?style=for-the-badge&logo=socket.io&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
</p>

---

<div align="center">

# 🚀 IndiaPlay - Premium Gaming Platform

> A full-stack gambling-style gaming platform with role-based access control, real-time notifications, and a premium responsive UI.

[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Stars](https://img.shields.io/github/stars/your-repo/indiaplay?style=for-the-badge&color=yellow)](https://github.com/your-repo/indiaplay/stargazers)
[![Forks](https://img.shields.io/github/forks/your-repo/indiaplay?style=for-the-badge&color=blue)](https://github.com/your-repo/indiaplay/network/members)
[![Issues](https://img.shields.io/github/issues/your-repo/indiaplay?style=for-the-badge&color=red)](https://github.com/your-repo/indiaplay/issues)

</div>

---

## ✨ Features

### 🎮 User Features

<div align="center">

| Feature | Description |
|---------|-------------|
| 📊 **Dashboard** | Personalized dashboard with balance, games played, wins, and streak |
| 🎰 **Games Library** | Browse and play various games with premium card UI |
| 💳 **Wallet System** | Add money, withdraw winnings, view transactions |
| 🎁 **Bonus Codes** | Redeem bonus codes for extra balance |
| 👥 **Referral System** | Earn by referring friends |
| 🏆 **Leaderboard** | Compete with other players |
| 👤 **Profile Management** | Update profile information |
| 🔔 **Real-time Notifications** | Get instant notifications via Socket.io |

</div>

### 👑 Admin Features

<div align="center">

| Feature | SUB_ADMIN | SUPER_ADMIN |
|---------|:---------:|:-----------:|
| 📊 Admin Dashboard | ✅ | ✅ |
| 👥 User Management | ✅ | ✅ |
| 💰 Withdrawal Management | ✅ | ✅ |
| 🎁 Bonus Code Management | ✅ | ✅ |
| 👮 Sub-admin Management | ❌ | ✅ |
| 📢 Broadcast Notifications | ❌ | ✅ |

</div>

---

## 🛠️ Tech Stack

### Frontend ⚛️

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
├─────────────────────────────────────────────────────────────┤
│  ⚛️  React 18         │  ⚡  Vite                          │
│  🎨  Tailwind CSS      │  🎬  Framer Motion                 │
│  💎  Lucide React      │  🔌  Socket.io Client              │
│  📡  Axios             │                                   │
└─────────────────────────────────────────────────────────────┘
```

### Backend 🖥️

```
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND                              │
├─────────────────────────────────────────────────────────────┤
|  🟢  Node.js            │  🚂  Express.js                    │
|  🗃️  PostgreSQL        │  📦  Prisma ORM                    │
|  🔐  JWT Auth           │  🔒  Bcrypt                       │
|  ⚡  Socket.io          │  🛡️  Helmet & CORS                │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Prerequisites

- **Node.js** v18 or higher
- **npm** or **yarn** package manager
- **PostgreSQL** database (local or cloud)

---

## 🚀 Quick Start

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-repo/indiaplay.git
cd indiaplay
```

### 2️⃣ Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3️⃣ Configure Environment

**Backend Configuration** - Create `server/.env`:

```env
# ═══════════════════════════════════════════════════════════
# DATABASE CONFIGURATION
# ═══════════════════════════════════════════════════════════
DATABASE_URL="postgresql://username:password@host:5432/database"

# ═══════════════════════════════════════════════════════════
# JWT CONFIGURATION
# Generate secrets using: openssl rand -hex 64
# ═══════════════════════════════════════════════════════════
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-refresh-token-secret"

# ═══════════════════════════════════════════════════════════
# SERVER CONFIGURATION
# ═══════════════════════════════════════════════════════════
PORT=3000
NODE_ENV=development
```

**Frontend Configuration** - Create `client/.env`:

```env
# API URL
VITE_API_URL=http://localhost:3000/api
```

### 4️⃣ Initialize Database

```bash
cd server

# Generate Prisma Client
npx prisma generate

# Run Migrations
npx prisma migrate dev --name init

# Seed Database (Optional)
npx prisma db seed
```

### 5️⃣ Launch Application

```bash
# Terminal 1 - Start Backend
cd server
npm run dev

# Terminal 2 - Start Frontend
cd client
npm run dev
```

---

## 🌐 Access Points

<div align="center">

| Service | URL | Description |
|---------|-----|-------------|
| 🎨 **Frontend** | http://localhost:5173 | React Application |
| ⚙️ **Backend** | http://localhost:3000 | Express API Server |
| 🗄️ **Prisma Studio** | http://localhost:3000/api | Database GUI |

</div>

---

## 📁 Project Structure

```
GAMBLING/
│
├── 📂 client/                     # 🎨 React Frontend
│   ├── 📂 src/
│   │   ├── 📂 components/        # Reusable UI Components
│   │   │   ├── AppLayout.jsx      # Main Layout Wrapper
│   │   │   ├── NotificationBell.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── ...
│   │   ├── 📂 context/           # React Context
│   │   │   ├── AuthContext.jsx   # Authentication State
│   │   │   └── SocketContext.jsx # Socket.io Connection
│   │   ├── 📂 pages/            # Page Components
│   │   │   ├── Dashboard.jsx     # User Dashboard
│   │   │   ├── Games.jsx         # Games Library
│   │   │   ├── Wallet.jsx        # Wallet & Transactions
│   │   │   ├── Deposit.jsx       # Add Money
│   │   │   ├── Bonus.jsx         # Bonus Codes
│   │   │   ├── Leaderboard.jsx   # Rankings
│   │   │   ├── Profile.jsx       # User Profile
│   │   │   ├── Referral.jsx      # Refer & Earn
│   │   │   ├── Notifications.jsx # Notifications
│   │   │   ├── GamePlay.jsx      # Game Play Screen
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminUsers.jsx
│   │   │   ├── AdminWithdrawals.jsx
│   │   │   ├── AdminSubadmins.jsx
│   │   │   ├── AdminBonusCodes.jsx
│   │   │   └── AdminBroadcast.jsx
│   │   ├── 📂 services/         # API Services
│   │   │   └── api.js
│   │   ├── App.jsx               # Main App Component
│   │   └── index.css             # Global Styles
│   ├── .env
│   ├── index.html
│   └── vite.config.js
│
├── 📂 server/                     # 🖥️ Express Backend
│   ├── 📂 prisma/
│   │   ├── schema.prisma         # Database Schema
│   │   └── seed.js               # Seed Data
│   ├── 📂 src/
│   │   ├── 📂 controllers/      # Route Controllers
│   │   │   ├── authController.js
│   │   │   ├── gameController.js
│   │   │   ├── walletController.js
│   │   │   ├── bonusController.js
│   │   │   ├── leaderboardController.js
│   │   │   ├── adminController.js
│   │   │   └── broadcastController.js
│   │   ├── 📂 middleware/        # Middleware Functions
│   │   │   └── auth.js           # JWT Authentication
│   │   ├── 📂 routes/           # API Routes
│   │   │   ├── auth.js
│   │   │   ├── games.js
│   │   │   ├── wallet.js
│   │   │   ├── bonus.js
│   │   │   ├── leaderboard.js
│   │   │   ├── admin.js
│   │   │   └── broadcast.js
│   │   ├── 📂 services/         # Business Logic
│   │   │   └── socketService.js  # Socket.io Service
│   │   └── 📂 utils/            # Utilities
│   ├── server.js                  # Main Server File
│   └── .env
│
├── 📂 .gitignore
├── 📄 README.md
└── 📄 package.json
```

---

## 🔐 Test Credentials

<div align="center">

| 👤 Role | 📧 Email | 🔑 Password | 🎯 Permissions |
|---------|----------|------------|----------------|
| **USER** | player@example.com | user123 | Play games, manage wallet, use bonuses |
| **SUB_ADMIN** | subadmin@indiaplay.com | admin123 | Manage users, handle withdrawals |
| **SUPER_ADMIN** | superadmin@indiaplay.com | super123 | Full access, broadcast notifications |

</div>

---

## 📡 API Documentation

### 🔓 Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | User login |
| `GET` | `/api/auth/me` | Get current user |
| `PUT` | `/api/auth/profile` | Update profile |

### 🎮 Game Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/games` | Get all games |
| `GET` | `/api/games/:id` | Get game by ID |
| `POST` | `/api/games` | Create game *(admin)* |
| `PUT` | `/api/games/:id` | Update game *(admin)* |
| `DELETE` | `/api/games/:id` | Delete game *(admin)* |

### 💳 Wallet Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/wallet/transactions` | Get transactions |
| `POST` | `/api/wallet/deposit` | Add money |
| `POST` | `/api/wallet/withdraw` | Request withdrawal |

### 🎁 Bonus Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/bonus` | Get all bonus codes |
| `POST` | `/api/bonus/redeem` | Redeem bonus code |
| `POST` | `/api/bonus` | Create bonus *(admin)* |
| `DELETE` | `/api/bonus/:id` | Delete bonus *(admin)* |

### 🏆 Leaderboard Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/leaderboard` | Get top players |

### 👑 Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/users` | Get all users |
| `PUT` | `/api/admin/users/:id` | Update user |
| `GET` | `/api/admin/withdrawals` | Get withdrawals |
| `PUT` | `/api/admin/withdrawals/:id` | Update withdrawal |
| `GET` | `/api/admin/subadmins` | Get sub-admins *(super)* |
| `POST` | `/api/admin/subadmins` | Create sub-admin *(super)* |

### 📢 Broadcast Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/admin/notify` | Send broadcast *(super)* |
| `GET` | `/api/broadcast` | Get user broadcasts |
| `GET` | `/api/broadcast/unread-count` | Get unread count |
| `PATCH` | `/api/broadcast/:id/read` | Mark as read |
| `PATCH` | `/api/broadcast/read-all` | Mark all as read |

---

## 🎨 Premium Features

### 🔔 Real-time Notifications
```
┌─────────────────────────────────────────────────────────┐
│  ⚡ Real-time Communication via Socket.io              │
├─────────────────────────────────────────────────────────┤
│  • Instant notification delivery                        │
│  • Admin broadcast to all users                         │
│  • Unread count badge                                   │
│  • Copy bonus codes from notifications                  │
└─────────────────────────────────────────────────────────┘
```

### 🛡️ Role-Based Access Control
```
┌─────────────────────────────────────────────────────────┐
│  👥 Three-tier Access System                            │
├─────────────────────────────────────────────────────────┤
│  USER ─────────────► Basic features                     │
│  SUB_ADMIN ────────► Extended admin features            │
│  SUPER_ADMIN ──────► Full platform control             │
└─────────────────────────────────────────────────────────┘
```

### 💎 Premium UI Components
```
┌─────────────────────────────────────────────────────────┐
│  ✨ Design Elements                                      │
├─────────────────────────────────────────────────────────┤
│  🌓 Dark Theme          │  🌈 Gradient Accents         │
│  💠 Glassmorphism        │  ✨ Skeleton Loaders          │
│  🎬 Smooth Animations    │  📱 Fully Responsive         │
│  🎯 Premium Cards        │  🔮 Glow Effects             │
└─────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

```
┌─────────────────────────────────────────────────────────┐
│  DATABASE MODELS                                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐     ┌──────────────┐     ┌───────────┐  │
│  │   USER   │────▶│  TRANSACTION │     │   GAME    │  │
│  └──────────┘     └──────────────┘     └───────────┘  │
│       │                                        │        │
│       │           ┌──────────────┐            │        │
│       └─────────▶│ BONUS_CODE   │◀───────────┘        │
│                   └──────────────┘                     │
│                                                         │
│  ┌─────────────────────────┐     ┌─────────────────┐  │
│  │ BROADCAST_NOTIFICATION │────▶│ USER_BROADCAST  │  │
│  └─────────────────────────┘     └─────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Troubleshooting

### 🐛 Common Issues

#### Database Connection Failed
```bash
# Check if DATABASE_URL is correct
# Ensure PostgreSQL is running
# For cloud DBs (Render), check if instance is awake
```

#### CORS Errors
```bash
# Verify backend CORS configuration in server.js
# Ensure VITE_API_URL matches backend URL
```

#### Build Errors
```bash
# Clear cache and reinstall
cd client
rm -rf node_modules dist .vite
npm install
npm run build
```

#### Socket.io Not Working
```bash
# Check Socket.io initialization in server.js
# Verify SocketContext connection in frontend
# Ensure CORS allows socket connections
```

### 🔄 Reset Database
```bash
cd server
npx prisma migrate reset --force
```

---

## 📝 Development Guide

### 🎯 Adding New Features

```bash
# 1. Backend
├── Add route in src/routes/
├── Add controller in src/controllers/
└── Update schema.prisma (if needed)

# 2. Frontend
├── Add API service in src/services/api.js
├── Create/Update component in src/pages/
└── Add route in App.jsx
```

### 🎨 Styling Guidelines

```css
/* Use Tailwind classes */
<div className="premium-card rounded-2xl ...">

/* Skeleton loaders */
<div className="skeleton skeleton-card ...">

/* Color scheme */
.primary      /* Primary brand color */
.success      /* Success/green */
.warning      /* Warning/amber */
.danger       /* Error/red */
```

### 📱 Responsive Breakpoints

```css
/* Mobile First */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
```

---

## 📜 License

<div align="center">

MIT License - Feel free to use this project for learning purposes.

**Made with ❤️ for IndiaPlay**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/indiaplay)

</div>

---

<div align="center">

## 🌟 Show Your Support

Give a ⭐ if this project helped you!

[![GitHub followers](https://img.shields.io/github/followers/your-username?style=social&logo=github)](https://github.com/your-username)
[![Twitter Follow](https://img.shields.io/twitter/follow/your-handle?style=social)](https://twitter.com/your-handle)

</div>

---

<p align="center">

![Footer Banner](https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,16,45&animation=fadeIn&fontSize=20&fontColor=fff&height=80&section=footer)

</p>
