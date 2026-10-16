# 🌾 KrishiLink - JSTU | Smart Agriculture Marketplace

> **Connecting Farmers Directly to Buyers — Eliminating Middlemen in Bangladesh**
> Project | Jamalpur Science and Technology University(JSTU) 

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://krishilink-jstu.vercel.app)
[![Tech](https://img.shields.io/badge/Built%20With-Next.js%2015%20%7C%20Supabase-black?style=flat-square)]()
[![Security](https://img.shields.io/badge/Security-Env%20Protected-blue)]()

### 🔗 Live Links
- **Website:** https://krishilink-jstu.vercel.app
- **GitHub:** https://github.com/tabassumarnica110-portfolio/Arnica-Tabassum
- **Video Demo:** (Add your Loom/YouTube link here)

---

### 📌 Problem Statement
Farmers in Bangladesh get 30-40% less price due to middlemen, lack of price transparency, and no direct market access. Existing platforms don't support local payment (bKash) and weather-based guidance.

### 💡 Our Solution: KrishiLink
A full-stack marketplace where:
- **Farmer** can list crops with price, quantity, image
- **Buyer** can directly purchase, order tracking
- **Admin** can verify farmers and manage transactions
- Integrated **Weather API** and **bKash Test Payment** for local context

### ✨ Key Features (For A+ Evaluation)

**1. Role-Based Authentication**
- Farmer Dashboard: Add Product, View Orders, Income Chart
- Buyer Dashboard: Cart, Checkout, Order History
- Admin Panel: User verification

**2. Smart Features (Unique)**
- 🌦️ Real-time Weather Widget for Farmer's District (OpenWeather API)
- 💰 bKash & Cash on Delivery Checkout Option
- 📦 Order Tracking System (Pending -> Shipped -> Delivered)
- 🔒 Secure Auth with Supabase Auth + NextAuth

**3. Full-Stack Architecture**
- Frontend: Next.js 15 (App Router), Tailwind CSS, ShadCN UI
- Backend: Next.js API Routes (`/api/products`, `/api/orders`, `/api/auth`)
- Database: Supabase PostgreSQL + Prisma ORM
- Deployment: Vercel (Frontend + Backend) + Supabase Cloud

### 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 15, TypeScript, Tailwind CSS |
| **Backend** | Next.js API Routes, Prisma |
| **Database** | Supabase PostgreSQL |
| **Auth** | Supabase Auth, NextAuth.js |
| **Payment** | Stripe (Test), bKash (Integration Ready) |
| **Deployment** | Vercel |

### 🗄️ Database Schema (ER Diagram)
- **User** (id, email, role: FARMER/BUYER/ADMIN)
- **Product** (id, name, price, quantity, farmerId, imageUrl)
- **Order** (id, buyerId, productId, status, totalAmount)
- **Relation:** User (1) -> Product (N), User (1) -> Order (N)

*Prisma Schema location: `/prisma/schema.prisma`*

### 🚀 Getting Started (For Sir/Reviewer)

1. Clone the repo:
```bash
git clone https://github.com/tabassumarnica110-portfolio/Arnica-Tabassum.git
cd Arnica-Tabassum
