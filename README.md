🌾KrishiLink - Direct Farmer to Buyer Marketplace | Project
<p align="center">
  <a href="https://krishilink-nine.vercel.app/"><img src="https://img.shields.io/badge/LIVE%20DEMO-Online-success?style=for-the-badge&logo=vercel" /></a>
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase" />
  <img src="https://img.shields.io/badge/Security-A%2B%20Grade-blue?style=for-the-badge&logo=security" />
</p>
<p align="center">
  <b>বাংলার কৃষকের ন্যায্য দাম নিশ্চিত করতে একটি Smart,Secure ও Scalable প্ল্যাটফর্ম</b><br/>
Project | Department of CSE,Jamalpur Science and Technology University(JSTU) | 2026
</p>
🔗 Quick Access for Evaluation
| Resource | Link |
| :--- | :--- |
|🌐 Live Website |
(https://krishilink-nine.vercel.app/) |
|💻 GitHub Repository| `github.com/tabassumarnica110-portfolio/Arnica-Tabassum`|
1.Problem Statement & Justification
Bangladesh e krisok ra fosoler 30-40% kom dam pay moddhoshottovogi,dam er oshocchota ebong abohawa-r purbabhas na thakar karone. Procholito platform gulo te "bKash er moto local payment** ebong **krishi-vittik feature** nei.

**SIH Problem Statement 26132:** *Strengthening market linkages and price discovery for farmers* - er upor vitti kore KrishiLink toiri.

### 💡 2. Proposed Solution - KrishiLink

KrishiLink e 3 jon user er jonno alada dashboard:

**👨‍🌾 Farmer (Krisok):**
- Product Add / Edit with Photo, Quantity, Price
- Order Notification Real-time
- Income Dashboard & Weather Widget (Jashore/Jhenaidah)

**🛒 Buyer (Kreta):**
- Fresh Product Browse, Cart, Search
- Secure Checkout - Cash on Delivery / bKash (Test Mode)
- Order Tracking: Pending → Shipped → Delivered

**👨‍💼 Admin:**
- Farmer Verification, Product Approval, User Management

### ✨ 3. Key Features That Ensure A+

**A. Technical Excellence (Sir etai dekhben)**
- **Full-Stack with Next.js 15 App Router:** Frontend + Backend (`/api`) ek sathe, alada server lagena
- **Role-Based Secure Authentication:** Supabase Auth + NextAuth.js, Middleware diye route protection
- **Database Design:** Prisma ORM + PostgreSQL, Proper Relation (User 1-N Product, User 1-N Order)
- **Security First:** Real secret key kokhono GitHub e nei, shudhu `.env.example` e `YOUR_KEY_HERE`. Production secret Vercel e.

**B. Unique Features (Onno project theke alada)**
- 🌦️ **Weather Intelligence:** Farmer dashboard e tar jela-r ajker abohawa (OpenWeather API) - Fasol bachate sahajjo kore
- 💰 **Localized Payment:** Bangladesh er jonno bKash / Nagad integration ready UI
- 📦 **Real-time Order Management:** Pusher diye order status update
- 📱 **Fully Responsive:** Mobile diye krisok sohoje use korte parbe

 4. Technology Stack

Frontend:      http://Next.js 15, TypeScript, Tailwind CSS, ShadCN/UI, Framer Motion
Backend:       http://Next.js API Routes, Prisma ORM, Zod Validation
Database:      Supabase (PostgreSQL) - Cloud Hosted
Auth:          Supabase Auth (Publishable Key + Secret Key)
Payment:       Stripe (Test), bKash Gateway (UI Ready)
Deployment:    Vercel (CI/CD with GitHub)
Tools:         Git, VS Code, Figma

### 🗄️ 5. System Architecture & ER Diagram

**Flow:** `Browser -> Next.js (Vercel) -> API Route -> Prisma -> Supabase DB -> Response`

**Core Tables:**
```prisma
model User { id, name, email, role [FARMER, BUYER, ADMIN], district }
model Product { id, name, price, quantity, imageUrl, farmerId -> User }
model Order { id, buyerId -> User, productId -> Product, status, totalAmount, paymentMethod }
- **Relation:** User (1) -> Product (N), User (1) -> Order (N)

*Prisma Schema location: `/prisma/schema.prisma`*

### 🚀 Getting Started (For Sir/Reviewer)

1. Clone the repo:
```bash
git clone https://github.com/tabassumarnica110-portfolio/Arnica-Tabassum.git
cd Arnica-Tabassum
