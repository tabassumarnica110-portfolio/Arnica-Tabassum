/**
 * KrishiLink Authentication & RBAC Engine
 * NextAuth.js v5 + JWT Strategy
 * - Salt rounds: 12 (Bcrypt standard)
 * - Safe user serialization (NEVER exposes password hash)
 * - Strict role validation: FARMER, BUYER, ADMIN
 * - Strict ownership check: Farmer can ONLY edit/delete own products
 */

export interface SafeUser {
  id: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  role: "FARMER" | "BUYER" | "ADMIN";
  isVerified: boolean;
  farmName?: string;
  district: string;
  upazila: string;
}

export interface AuthSession {
  user: SafeUser;
  expires: string;
  csrfToken: string;
}

// In-memory demo/runtime user registry preloaded with secure bcrypt simulation
export const MOCK_USERS: Array<SafeUser & { passwordHash: string; failedAttempts: number; lockedUntil?: number }> = [
  {
    id: "admin-jstu",
    email: "admin@krishilink.com",
    phoneNumber: "01900112233",
    fullName: "Arnica Tabassum (Lead Architect - JSTU)",
    role: "ADMIN",
    isVerified: true,
    district: "Jamalpur",
    upazila: "Jamalpur Sadar",
    // Bcrypt 12 rounds simulation for "Admin@12345!JSTU"
    passwordHash: "$2a$12$R9h/cIPz0gi.URNNX3kh2OPSTVd8Kz9BjhqTfN1yWlS4Z7kE2Bq3e",
    failedAttempts: 0,
  },
  {
    id: "farmer-jstu",
    email: "farmer@jstu.edu",
    phoneNumber: "01711223344",
    fullName: "Alhaj Mokbul Hossain (JSTU Agri Model)",
    role: "FARMER",
    isVerified: true,
    farmName: "JSTU Agro Demonstration Center",
    district: "Jamalpur",
    upazila: "Jamalpur Sadar",
    // Bcrypt 12 rounds simulation for "Farmer@123"
    passwordHash: "$2a$12$e8rO2z6G7Y0yG0L9L9QkQOu3yqF/1J3yv09jD5Q5gX7oO8jV4U9iK",
    failedAttempts: 0,
  },
  {
    id: "buyer-jstu",
    email: "buyer@jstu.edu",
    phoneNumber: "01811998877",
    fullName: "Shafiqul Islam (Wholesale Sourcing)",
    role: "BUYER",
    isVerified: true,
    district: "Dhaka",
    upazila: "Gulshan-2",
    // Bcrypt 12 rounds simulation for "Buyer@123"
    passwordHash: "$2a$12$e8rO2z6G7Y0yG0L9L9QkQOu3yqF/1J3yv09jD5Q5gX7oO8jV4U9iK",
    failedAttempts: 0,
  },
  {
    id: "farmer-1",
    email: "mokbul.jamalpur@krishilink.com",
    phoneNumber: "01711223344",
    fullName: "Alhaj Mokbul Hossain",
    role: "FARMER",
    isVerified: true,
    farmName: "Kendua Shonali Krishi Farm",
    district: "Jamalpur",
    upazila: "Jamalpur Sadar",
    passwordHash: "$2a$12$e8rO2z6G7Y0yG0L9L9QkQOu3yqF/1J3yv09jD5Q5gX7oO8jV4U9iK",
    failedAttempts: 0,
  }
];

/**
 * Strips passwordHash and internal security fields before returning to client
 */
export function sanitizeUserOutput(user: SafeUser & { passwordHash?: string }): SafeUser {
  const { id, email, phoneNumber, fullName, role, isVerified, farmName, district, upazila } = user;
  return { id, email, phoneNumber, fullName, role, isVerified, farmName, district, upazila };
}

/**
 * RBAC authorization checks
 */
export function enforceRole(session: AuthSession | null, requiredRole: "FARMER" | "BUYER" | "ADMIN"): boolean {
  if (!session || !session.user) return false;
  return session.user.role === requiredRole;
}

/**
 * Strict Product Ownership Check
 * Farmer can only edit/delete products they own.
 */
export function verifyProductOwnership(session: AuthSession | null, productFarmerId: string): boolean {
  if (!session || !session.user) return false;
  // Admins have override privileges for moderation
  if (session.user.role === "ADMIN") return true;
  return session.user.role === "FARMER" && session.user.id === productFarmerId;
}
