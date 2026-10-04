import { z } from "zod";

/**
 * KrishiLink Security Validation Layer
 * Enforces strict schemas, regex rules, sanitization against XSS, SQLi, and bots.
 */

// Multi-vector security sanitizer against XSS, SQLi, Shell injection, and Memory DoS
export function sanitizeInput(input: string, maxLength: number = 3000): string {
  if (typeof input !== "string") return "";
  
  // Guard against ReDoS and buffer overflow
  const truncated = input.slice(0, maxLength);

  return truncated
    // Strip malicious tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
    .replace(/<applet\b[^<]*(?:(?!<\/applet>)<[^<]*)*<\/applet>/gi, "")
    // Strip dangerous URI schemes
    .replace(/javascript\s*:/gi, "blocked-scheme:")
    .replace(/vbscript\s*:/gi, "blocked-scheme:")
    .replace(/data\s*:\s*text\/html/gi, "blocked-scheme:")
    // Strip inline execution handlers
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/on\w+\s*=\s*[^>\s]+/gi, "")
    // Escape dangerous HTML entities
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .trim();
}

/**
 * Real-time intrusion detector
 * Evaluates inputs for classic SQLi, XSS, and command injection patterns
 */
export function detectMaliciousPayload(input: string): { isMalicious: boolean; threatType?: "SQLI" | "XSS" | "COMMAND_INJECTION" | "PATH_TRAVERSAL"; description?: string } {
  if (!input || typeof input !== "string") return { isMalicious: false };

  // 1. SQL Injection Signatures
  const sqliPatterns = [
    /('|\b)(OR|AND)\b.+(=|<|>|LIKE)/i,
    /\bUNION\b\s+\b(ALL\b\s+)?\bSELECT\b/i,
    /\b(DROP|ALTER|TRUNCATE|DELETE)\b\s+\b(TABLE|DATABASE|FROM)\b/i,
    /--|#|\/\*|\*\/|;\s*--/i,
    /\bxp_cmdshell\b|\bBENCHMARK\b|\bSLEEP\b\s*\(/i,
  ];

  for (const pattern of sqliPatterns) {
    if (pattern.test(input)) {
      return {
        isMalicious: true,
        threatType: "SQLI",
        description: `SQL injection pattern matched: ${pattern.toString()}`,
      };
    }
  }

  // 2. Cross-Site Scripting (XSS) Signatures
  const xssPatterns = [
    /<script\b/i,
    /javascript\s*:/i,
    /onerror\s*=/i,
    /onload\s*=/i,
    /<svg\b[^>]*\bonload/i,
    /<img\b[^>]*\bonerror/i,
    /document\.(cookie|location|domain)/i,
    /window\.(location|localStorage|sessionStorage)/i,
    /eval\s*\(|Function\s*\(/i,
  ];

  for (const pattern of xssPatterns) {
    if (pattern.test(input)) {
      return {
        isMalicious: true,
        threatType: "XSS",
        description: `Cross-site scripting (XSS) payload detected: ${pattern.toString()}`,
      };
    }
  }

  // 3. Path Traversal Signatures
  if (/\.\.\/|\.\.\\/i.test(input)) {
    return {
      isMalicious: true,
      threatType: "PATH_TRAVERSAL",
      description: "Directory traversal attack detected (../ pattern)",
    };
  }

  // 4. Command Injection Signatures
  if (/(\||&{2}|;)\s*(cat|ls|rm|curl|wget|nc|sh|bash)\b/i.test(input)) {
    return {
      isMalicious: true,
      threatType: "COMMAND_INJECTION",
      description: "Shell command injection sequence detected",
    };
  }

  return { isMalicious: false };
}

/**
 * Defensive positive finite numeric validator
 * Prevents NaN, -Infinity, negative numbers, and integer overflow crash exploits
 */
export function isSafePositiveNumber(value: unknown, maxLimit: number = 10000000): boolean {
  if (typeof value !== "number") return false;
  if (!Number.isFinite(value) || Number.isNaN(value)) return false;
  return value > 0 && value <= maxLimit;
}

// 1. Password policy: min 8 chars, 1 uppercase, 1 number, 1 special char
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character (!@#$%^&*)");

// 2. Bangladeshi Phone Number Regex (013, 014, 015, 016, 017, 018, 019 followed by 8 digits)
export const banglaPhoneSchema = z
  .string()
  .regex(/^(?:\+8801|01)[3-9]\d{8}$/, "Must be a valid Bangladeshi phone number (e.g. 01711223344)");

// 3. User Register Schema
export const RegisterSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters").max(100),
  email: z.string().email("Invalid email address"),
  phoneNumber: banglaPhoneSchema,
  password: passwordSchema,
  role: z.enum(["FARMER", "BUYER", "ADMIN"]),
  district: z.string().min(2, "District is required"),
  upazila: z.string().min(2, "Upazila is required"),
  village: z.string().optional(),
  farmName: z.string().optional(),
  honeypot: z.string().max(0, "Bot detected").optional().or(z.literal("")),
});

// 4. User Login Schema
export const LoginSchema = z.object({
  identifier: z.string().min(3, "Email or phone is required"),
  password: z.string().min(1, "Password is required"),
  honeypot: z.string().max(0, "Bot detected").optional().or(z.literal("")),
});

// 5. Product Create Schema (Farmer Role)
export const ProductCreateSchema = z.object({
  name: z.string().min(3, "Crop name must be at least 3 characters").max(120),
  category: z.enum(["DHAN", "ALU", "BEGUN", "POTOL", "MORICH", "MACH", "PEYAJ", "ROSHUN", "SHOBJI", "FOL"]),
  variety: z.string().min(2).max(80).optional(),
  quantityKg: z.number().positive("Quantity must be greater than zero"),
  minOrderKg: z.number().positive("Minimum order must be greater than zero").default(5),
  pricePerKg: z.number().positive("Price must be a positive number"),
  harvestDate: z.string(),
  isOrganic: z.boolean().default(false),
  description: z.string().max(1000).optional(),
  images: z.array(z.string().url("Must be valid image URL")).min(1, "At least 1 product image required"),
  district: z.string().default("Jamalpur"),
  upazila: z.string().default("Jamalpur Sadar"),
});

// 6. Cold Storage Booking Schema
export const ColdStorageBookingSchema = z.object({
  storageId: z.string().uuid().or(z.string().min(3)),
  cropType: z.string().min(2),
  numberOfBags: z.number().int().positive("Must be at least 1 bag"),
  totalWeightKg: z.number().positive(),
  durationMonths: z.number().int().min(1).max(12).default(3),
});

// 7. Live Auction Bid Schema
export const AuctionBidSchema = z.object({
  auctionId: z.string(),
  bidPricePerKg: z.number().positive("Bid price must be greater than zero"),
  offeredQuantityKg: z.number().positive(),
  farmerMessage: z.string().max(250).optional(),
});

// 8. Order Placement Schema
export const OrderPlacementSchema = z.object({
  deliveryAddress: z.object({
    recipientName: z.string().min(2),
    recipientPhone: banglaPhoneSchema,
    district: z.string().min(2),
    upazila: z.string().min(2),
    streetAddress: z.string().min(5),
  }),
  paymentMethod: z.enum(["BKASH", "NAGAD", "ROCKET", "STRIPE", "CASH_ON_DELIVERY"]),
  items: z.array(z.object({
    productId: z.string(),
    quantityKg: z.number().positive(),
  })).min(1, "Cart cannot be empty"),
  deliveryDistanceKm: z.number().nonnegative().default(15),
});

// 9. Disease Diagnosis Upload Schema
export const DiseaseDiagnosisSchema = z.object({
  cropType: z.string().min(2),
  imageFileBase64: z.string().min(10, "Valid image required"),
  notes: z.string().max(300).optional(),
});
