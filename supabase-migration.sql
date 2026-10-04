-- ==============================================================================
-- KrishiLink (কৃষিলিংক) — Production Database Migration & Row Level Security (RLS)
-- Developed by Arnica Tabassum | Dept. of CSE | Jamalpur Science And Technology University (JSTU)
-- Run this complete SQL script in the Supabase SQL Editor
-- ==============================================================================

-- 1. Enable Required PostgreSQL Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create Enums
DO $$ BEGIN
    CREATE TYPE "Role" AS ENUM ('FARMER', 'BUYER', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "OrderStatus" AS ENUM ('NEW', 'ACCEPTED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'DISPUTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "PaymentMethod" AS ENUM ('BKASH', 'NAGAD', 'ROCKET', 'STRIPE', 'SSLCOMMERZ', 'CASH_ON_DELIVERY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "ProductCategory" AS ENUM ('DHAN', 'ALU', 'BEGUN', 'POTOL', 'MORICH', 'MACH', 'PEYAJ', 'ROSHUN', 'SHOBJI', 'FOL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "AuctionStatus" AS ENUM ('ACTIVE', 'CLOSED', 'AWARDED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Core Users & RBAC
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "email" TEXT UNIQUE NOT NULL,
    "phoneNumber" TEXT UNIQUE NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'BUYER',
    "avatarUrl" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockoutUntil" TIMESTAMP WITH TIME ZONE,
    "lastLoginAt" TIMESTAMP WITH TIME ZONE,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "FarmerProfile" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT UNIQUE NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "farmName" TEXT NOT NULL,
    "division" TEXT NOT NULL DEFAULT 'Mymensingh',
    "district" TEXT NOT NULL DEFAULT 'Jamalpur',
    "upazila" TEXT NOT NULL DEFAULT 'Jamalpur Sadar',
    "unionName" TEXT,
    "village" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL DEFAULT 24.9200,
    "longitude" DOUBLE PRECISION NOT NULL DEFAULT 89.9400,
    "nidNumber" TEXT UNIQUE,
    "nidFrontUrl" TEXT,
    "nidBackUrl" TEXT,
    "isNidVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "organicCertified" BOOLEAN NOT NULL DEFAULT false,
    "organicCertUrl" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 4.9,
    "totalRatingsCount" INTEGER NOT NULL DEFAULT 0,
    "totalSalesTaka" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "landSizeAcres" DOUBLE PRECISION DEFAULT 2.5,
    "bkashNumber" TEXT,
    "bio" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "BuyerProfile" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT UNIQUE NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "buyerType" TEXT NOT NULL DEFAULT 'FAMILY',
    "organizationName" TEXT,
    "tradeLicenseNumber" TEXT,
    "district" TEXT NOT NULL DEFAULT 'Dhaka',
    "preferredLanguage" TEXT NOT NULL DEFAULT 'bn',
    "isWholesalerVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Address" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "label" TEXT NOT NULL DEFAULT 'Home',
    "recipientName" TEXT NOT NULL,
    "recipientPhone" TEXT NOT NULL,
    "division" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "upazila" TEXT NOT NULL,
    "streetAddress" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 4. Products & Traceability
CREATE TABLE IF NOT EXISTS "Product" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "farmerId" TEXT NOT NULL REFERENCES "FarmerProfile"("id") ON DELETE CASCADE,
    "name" TEXT NOT NULL,
    "banglaName" TEXT,
    "category" "ProductCategory" NOT NULL,
    "variety" TEXT,
    "quantityAvailableKg" DOUBLE PRECISION NOT NULL,
    "minimumOrderKg" DOUBLE PRECISION NOT NULL DEFAULT 5,
    "pricePerKg" DOUBLE PRECISION NOT NULL,
    "governmentMarketPrice" DOUBLE PRECISION,
    "historicalAvgPrice" DOUBLE PRECISION,
    "harvestDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "isOrganic" BOOLEAN NOT NULL DEFAULT false,
    "isQcApproved" BOOLEAN NOT NULL DEFAULT false,
    "qcInspectorNotes" TEXT,
    "images" TEXT[] NOT NULL DEFAULT '{}',
    "qrCodeToken" TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
    "traceabilityTimeline" JSONB,
    "description" TEXT,
    "shelfLifeDays" INTEGER NOT NULL DEFAULT 7,
    "district" TEXT NOT NULL DEFAULT 'Jamalpur',
    "upazila" TEXT NOT NULL DEFAULT 'Jamalpur Sadar',
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 5. Orders, Logistics & Payments
CREATE TABLE IF NOT EXISTS "Order" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "orderNumber" TEXT UNIQUE NOT NULL,
    "buyerId" TEXT NOT NULL REFERENCES "User"("id"),
    "deliveryAddressId" TEXT NOT NULL REFERENCES "Address"("id"),
    "status" "OrderStatus" NOT NULL DEFAULT 'NEW',
    "totalItemsAmountTaka" DOUBLE PRECISION NOT NULL,
    "deliveryFeeTaka" DOUBLE PRECISION NOT NULL,
    "platformCommissionTaka" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "grandTotalTaka" DOUBLE PRECISION NOT NULL,
    "distanceKm" DOUBLE PRECISION,
    "trackingTimeline" JSONB,
    "deliveryAgentName" TEXT,
    "deliveryAgentPhone" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "OrderItem" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "orderId" TEXT NOT NULL REFERENCES "Order"("id") ON DELETE CASCADE,
    "productId" TEXT NOT NULL REFERENCES "Product"("id"),
    "quantityKg" DOUBLE PRECISION NOT NULL,
    "unitPriceTaka" DOUBLE PRECISION NOT NULL,
    "totalPriceTaka" DOUBLE PRECISION NOT NULL
);

CREATE TABLE IF NOT EXISTS "Payment" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "orderId" TEXT UNIQUE NOT NULL REFERENCES "Order"("id") ON DELETE CASCADE,
    "amountTaka" DOUBLE PRECISION NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "transactionId" TEXT UNIQUE,
    "stripePaymentIntentId" TEXT,
    "bkashTrxId" TEXT,
    "tokenizedToken" TEXT,
    "paidAt" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 6. Wholesale Auctions & Cold Storage
CREATE TABLE IF NOT EXISTS "Auction" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "buyerProfileId" TEXT NOT NULL REFERENCES "BuyerProfile"("id") ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "category" "ProductCategory" NOT NULL,
    "requiredQuantityKg" DOUBLE PRECISION NOT NULL,
    "targetPricePerKg" DOUBLE PRECISION,
    "districtRequired" TEXT NOT NULL DEFAULT 'Jamalpur',
    "deadline" TIMESTAMP WITH TIME ZONE NOT NULL,
    "status" "AuctionStatus" NOT NULL DEFAULT 'ACTIVE',
    "winningBidId" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Bid" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "auctionId" TEXT NOT NULL REFERENCES "Auction"("id") ON DELETE CASCADE,
    "farmerId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "bidPricePerKg" DOUBLE PRECISION NOT NULL,
    "offeredQuantityKg" DOUBLE PRECISION NOT NULL,
    "farmerMessage" TEXT,
    "isAccepted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "ColdStorage" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "division" TEXT NOT NULL DEFAULT 'Mymensingh',
    "district" TEXT NOT NULL DEFAULT 'Jamalpur',
    "upazila" TEXT NOT NULL DEFAULT 'Jamalpur Sadar',
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL DEFAULT 24.9180,
    "longitude" DOUBLE PRECISION NOT NULL DEFAULT 89.9510,
    "totalCapacityMetricTons" DOUBLE PRECISION NOT NULL DEFAULT 5000,
    "availableCapacityTons" DOUBLE PRECISION NOT NULL DEFAULT 1500,
    "temperatureCelsius" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "humidityPercentage" DOUBLE PRECISION NOT NULL DEFAULT 88,
    "ratePerBagPerMonth" DOUBLE PRECISION NOT NULL DEFAULT 105,
    "contactPhone" TEXT NOT NULL,
    "managerName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "ColdStorageBooking" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "storageId" TEXT NOT NULL REFERENCES "ColdStorage"("id"),
    "farmerId" TEXT NOT NULL REFERENCES "FarmerProfile"("id") ON DELETE CASCADE,
    "cropType" TEXT NOT NULL,
    "numberOfBags" INTEGER NOT NULL,
    "totalWeightKg" DOUBLE PRECISION NOT NULL,
    "storageDurationMonths" INTEGER NOT NULL DEFAULT 3,
    "totalCostTaka" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'CONFIRMED',
    "bookingDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 7. Audit Trail & Compliance
CREATE TABLE IF NOT EXISTS "AuditLog" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT REFERENCES "User"("id") ON DELETE SET NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT,
    "status" TEXT NOT NULL,
    "details" JSONB,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES — UNHACKABLE DATA PROTECTION
-- ==============================================================================

-- Enable RLS on all primary tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FarmerProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BuyerProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Address" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Payment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Auction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Bid" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ColdStorage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ColdStorageBooking" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;

-- Product Policies:
-- 1. Anyone can view QC-approved products
CREATE POLICY "Public can view approved crops" ON "Product"
    FOR SELECT USING ("isQcApproved" = true);

-- 2. Farmer can view all of their own crops (approved or unapproved)
CREATE POLICY "Farmers can manage own crops" ON "Product"
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM "FarmerProfile"
            WHERE "FarmerProfile"."id" = "Product"."farmerId"
            AND "FarmerProfile"."userId" = auth.uid()::text
        )
    );

-- 3. Admin has master override to review and moderate
CREATE POLICY "Admins full access to products" ON "Product"
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM "User"
            WHERE "User"."id" = auth.uid()::text
            AND "User"."role" = 'ADMIN'
        )
    );

-- Order Policies:
-- Buyers can view their own orders
CREATE POLICY "Buyers view own orders" ON "Order"
    FOR SELECT USING ("buyerId" = auth.uid()::text);

-- Admins can view and dispatch all orders
CREATE POLICY "Admins full access to orders" ON "Order"
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM "User"
            WHERE "User"."id" = auth.uid()::text
            AND "User"."role" = 'ADMIN'
        )
    );

-- AuditLog Policies:
-- Only ADMIN can view security forensics
CREATE POLICY "Admin view audit logs only" ON "AuditLog"
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM "User"
            WHERE "User"."id" = auth.uid()::text
            AND "User"."role" = 'ADMIN'
        )
    );

-- Anyone can insert audit logs through backend RPC
CREATE POLICY "System can record audit logs" ON "AuditLog"
    FOR INSERT WITH CHECK (true);

-- Cold Storage Policies:
-- Anyone can view active cold storage facilities
CREATE POLICY "Public view active cold storages" ON "ColdStorage"
    FOR SELECT USING ("isActive" = true);

-- Seed initial Admin User for defense
INSERT INTO "User" ("id", "email", "phoneNumber", "passwordHash", "fullName", "role", "isVerified")
VALUES (
    'admin-jstu',
    'admin@krishilink.com',
    '01900112233',
    '$2a$12$R9h/cIPz0gi.URNNX3kh2OPSTVd8Kz9BjhqTfN1yWlS4Z7kE2Bq3e',
    'Arnica Tabassum (Lead Architect - JSTU)',
    'ADMIN',
    true
) ON CONFLICT ("email") DO NOTHING;
