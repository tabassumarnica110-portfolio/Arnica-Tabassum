# 🌾 KrishiLink™ (কৃষিলিঙ্ক)
### Smart Direct Farmer-to-Buyer Supply Chain & Agricultural Intelligence Platform for Bangladesh
**Developed by:** **Arnica Tabassum**  
**Department:** **Computer Science & Engineering (CSE)**  
**Institution:** **Jamalpur Science And Technology University (JSTU)**  
**Official Repository:** [https://github.com/tabassumarnica110-portfolio/Arnica-Tabassum](https://github.com/tabassumarnica110-portfolio/Arnica-Tabassum)  
**Production Prototype URL:** [https://krishilink-jstu.vercel.app](https://krishilink-jstu.vercel.app)

---

## 📌 Executive Summary & Thesis Scope
**KrishiLink** is an enterprise-grade digital agriculture platform designed to eliminate abusive middlemen from Bangladesh's agrarian supply chain. Connecting rural smallholder farmers directly with urban consumers, wholesale corporate buyers, cold storage facilities, and agricultural extension officers, KrishiLink integrates **real-time plant pathology diagnosis, IoT cold chain logistics tracking, yield forecasting, and government-approved fertilizer scheduling**.

---

## 🛠️ Complete Technology Stack & Architecture

### 1. Frontend Engineering
- **Core Library & Framework:** React 19, TypeScript, Vite SPA architecture.
- **Styling & Design System:** Tailwind CSS (utility-first, responsive dark/light agro-palette, zero generic AI placeholders).
- **Icons & Visuals:** Lucide React icons, high-density SVG telemetry meters and radar canvases.
- **Voice & Accessibility:** Web Speech Recognition API (`bn-BD`) and Web Speech Synthesis (natural Bangla voice readouts for low-literate rural farmers).
- **Offline Resiliency (PWA):** Custom Service Worker (`public/sw.js`) and LocalState Caching (`lib/offlineStorage.ts`) enabling remote char farmers to log products, view crop guides, and queue orders without active internet.

### 2. Backend & Security Architecture
- **Server Runtime:** Node.js, Express & Next.js Edge Middleware (`middleware.ts`).
- **Authentication & Cryptography:** Bcrypt 12 salt rounds password hashing (`$2a$12$...`), session token sanitization (`lib/auth.ts`).
- **Data Validation & Sanitization:** Strict Zod runtime schemas (`lib/validation.ts`), DOMPurify XSS defense, SQL Injection parameterized queries (`lib/security.ts`).
- **Rate Limiting & Anti-Bot Shield:** In-Memory & Redis Sliding-Window Rate Limiter (`lib/rate-limit.ts`) and invisible form honeypots.
- **Role-Based Access Control (RBAC):** Distinct administrative, verified farmer, and buyer permission boundaries.

### 3. Database & Schemas
- **Relational Database:** PostgreSQL with Supabase RLS policies (`supabase-migration.sql`).
- **Object-Relational Mapping (ORM):** Prisma ORM (`prisma/schema.prisma`) with automated seed scripts (`prisma/seed.ts`).
- **Tables & Relational Entities:** `User`, `FarmerProfile`, `Product`, `Order`, `OrderItem`, `ColdStorageBooking`, `LogisticsTracking`, `PestReport`, `AuditLog`.

---

## 🚀 Key Functional Modules Implemented

### 🌾 1. Low-Literate Farmer Command Hub (`src/components/farmer/`)
- **Bangla Voice Listing:** Farmers can speak in Bangla (e.g. *"৫০ কেজি আলু ৩০ টাকা"*) to automatically parse and list farmgate produce.
- **11-Crop AI Plant Pathology Lab (`DiseaseDetector.tsx`):**
  - Instant dual diagnosis: **🔴 টেস্ট ১ (রোগাক্রান্ত ফসল)** vs **🟢 টেস্ট ২ (১০০% সুস্থ ফসল)** across 11 key crops: আলু (Potato), বেগুন (Brinjal), ধান (Rice), পটল (Potol), লাউ (Bottle Gourd), মিষ্টি কুমড়ো (Pumpkin), কাঁচা মরিচ (Chili), টমেটো (Tomato), আম (Mango), লিচু (Litchi), and আনারস (Pineapple).
  - Authentic high-resolution pathology samples with scientific etiology, symptoms, and exact DAE-approved chemical & organic curative dosages.
  - Natural Bangla voice speech readout (`🔊 বাংলায় শুনুন`) and official DAE prescription printout.
- **IoT Cold Chain Truck Route Visualizer (`ColdChainRouteVisualizer.tsx`):**
  - Real-time location and expected arrival time (ETA) countdown of temperature-controlled refrigerated trucks near the farmer's village.
  - Live IoT telemetry: Reefer temperature (`-18°C` to `+4°C`), chamber humidity, speed, driver contact, and 1-click pickup confirmation.
- **Seasonal Farming Guidance & Fertilizer Timetable (`SeasonalFarmingGuidance.tsx`):**
  - Stage-by-stage fertilizer application schedule according to BARC (Bangladesh Agricultural Research Council) and DAE recommendations across রবি (Rabi), খরিফ-১ (Kharif-1), and খরিফ-২ (Kharif-2) seasons.
  - Basal dosing, vegetative growth, flowering, and harvest intervals.
- **Smart Integrated Pest Management (`SmartPestManager.tsx`):**
  - Dual-track organic bio-control (Neem, Trichoderma, Pheromone traps) and DAE-registered chemical remedies with Pre-Harvest Interval (PHI) compliance.
- **Crop Yield Forecasting (`YieldForecaster.tsx`):**
  - Predictive modeling based on land acreage, seed certification, soil health, and 3-year historical yields, outputting expected maunds (মণ), metric tons, and net revenue in BDT.
- **Regional Pest Outbreak Threat Radar (`RegionalPestMap.tsx`):**
  - Interactive map covering Jamalpur Sadar, Melandaha, Islampur, Dewanganj, Sarishabari, and Madarganj with proximity warnings within a 5–15 km radius.

### 🛒 2. Direct Buyer Marketplace (`src/components/buyer/`)
- **Direct Farmgate Shop:** Buy fresh produce directly without intermediary broker markups.
- **Blockchain QR Traceability (`TraceabilityQRModal.tsx`):** Cryptographic QR code verifying harvest date, farmer NID KYC, testing lab approval, and cold chain temperature history.
- **Real-Time Price Bargaining Chat (`BargainingChatModal.tsx`):** Direct negotiation between verified buyers and farmers.
- **Order Tracking & Delivery Kanban:** Status progression from farmgate packing to reefer truck dispatch and final delivery.

### 🛡️ 3. Platform Administration & Governance (`src/components/admin/`)
- **Farmer KYC & NID Verification:** Document review for subsidized fertilizer and cold storage allocations.
- **Quality Control (QC) Lab Approvals:** Chemical residue and grading verification.
- **Cybersecurity Forensics Audit Trail:** Real-time logging of user activity, authentication events, and route access attempts.

---

## 🔑 Demonstration Credentials (Bcrypt Protected)

| Portal / Role | Live Login Identifier | Demo Password | Security Privileges |
| :--- | :--- | :--- | :--- |
| **🛡️ Platform Admin** | `admin@krishilink.com` | `Admin@12345!JSTU` | Administrative oversight, KYC approval, QC clearance, audit logs |
| **👨‍🌾 Verified Farmer** | `farmer@jstu.edu` | `Farmer@123` | Farmgate shop listing, voice input, cold chain tracking, pathology lab |
| **🛒 Consumer / Buyer** | `buyer@jstu.edu` | `Buyer@123` | Direct purchasing, QR traceability, live bargaining, payment checkout |

---

## 💻 Local Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/tabassumarnica110-portfolio/Arnica-Tabassum.git
cd Arnica-Tabassum

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env

# 4. Run database migrations (PostgreSQL / Supabase)
npx prisma db push
npx prisma db seed

# 5. Start development server
npm run dev
```

---

## 📤 Git Synchronisation & Push Guide

To push all updates directly to your GitHub repository:

```bash
# Initialize and link repository
git init
git config user.name "Arnica Tabassum"
git config user.email "tabassumarnica110@gmail.com"
git branch -M main

# Add all project source files
git add .
git commit -m "feat: KrishiLink - Complete Enterprise AgriTech Platform by Arnica Tabassum, JSTU"

# Link to GitHub and push
git remote add origin https://github.com/tabassumarnica110-portfolio/Arnica-Tabassum.git
git push -u origin main
```

---

**Developed with dedication for the farmers of Bangladesh by Arnica Tabassum, Department of CSE, Jamalpur Science and Technology University (JSTU).**
