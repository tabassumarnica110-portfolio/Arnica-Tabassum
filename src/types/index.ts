/**
 * KrishiLink Core TypeScript Types
 */

export type Role = "FARMER" | "BUYER" | "ADMIN";

export type ProductCategory = 
  | "DHAN" 
  | "ALU" 
  | "BEGUN" 
  | "POTOL" 
  | "MORICH" 
  | "MACH" 
  | "PEYAJ" 
  | "ROSHUN" 
  | "SHOBJI" 
  | "FOL";

export type OrderStatus = 
  | "NEW" 
  | "ACCEPTED" 
  | "PACKED" 
  | "SHIPPED" 
  | "DELIVERED" 
  | "CANCELLED";

export type PaymentMethod = 
  | "BKASH" 
  | "SSLCOMMERZ"
  | "NAGAD" 
  | "ROCKET" 
  | "STRIPE" 
  | "CASH_ON_DELIVERY"
  | "KRISHIPAY_ESCROW"
  | "KRISHIPAY_GROUP_SPLIT";

export interface Farmer {
  id: string;
  name: string;
  phone: string;
  email: string;
  village: string;
  upazila: string;
  district: string;
  lat: number;
  lng: number;
  rating: number;
  ratingsCount: number;
  salesTaka: number;
  landAcres: number;
  bio: string;
  nidNumber: string;
  nidFrontUrl?: string;
  nidBackUrl?: string;
  isNidVerified: boolean;
  organicCertified: boolean;
}

export interface ProductTraceStep {
  date: string;
  title: string;
  banglaTitle: string;
  description: string;
  location: string;
  verifiedBy: string;
  txHash: string;
}

export interface Product {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  name: string;
  banglaName: string;
  category: ProductCategory;
  variety: string;
  quantityKg: number;
  minOrderKg: number;
  pricePerKg: number;
  govPrice: number;
  histAvgPrice: number;
  harvestDate: string;
  isOrganic: boolean;
  isQcApproved: boolean;
  qcInspectorNotes: string;
  images: string[];
  shelfLifeDays: number;
  district: string;
  upazila: string;
  description: string;
  qrCodeToken: string;
  traceability: ProductTraceStep[];
}

export interface ColdStorage {
  id: string;
  name: string;
  upazila: string;
  district: string;
  address: string;
  lat: number;
  lng: number;
  totalCapTons: number;
  availCapTons: number;
  tempC: number;
  humidity: number;
  ratePerBagMonth: number;
  contactPhone: string;
  managerName: string;
}

export interface ColdStorageBooking {
  id: string;
  storageId: string;
  storageName: string;
  farmerId: string;
  cropType: string;
  bagsCount: number;
  totalWeightKg: number;
  durationMonths: number;
  totalCostTaka: number;
  status: "CONFIRMED" | "STORED" | "DISCHARGED";
  bookingDate: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  banglaName: string;
  quantityKg: number;
  unitPrice: number;
  totalPrice: number;
  farmerId: string;
  farmerName: string;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  deliveryAddress: string;
  district: string;
  status: OrderStatus;
  items: OrderItem[];
  itemsTotal: number;
  deliveryFee: number;
  platformFee: number;
  grandTotal: number;
  distanceKm: number;
  paymentMethod: PaymentMethod;
  paymentStatus: "PENDING" | "PAID";
  trackingCheckpoints: {
    status: OrderStatus;
    timestamp: string;
    note: string;
  }[];
  deliveryAgent?: {
    name: string;
    phone: string;
    vehicleNumber: string;
  };
  escrowId?: string;
  escrowStatus?: "LOCKED_IN_VAULT" | "IN_TRANSIT" | "RELEASED" | "DISPUTED";
  escrowGateway?: "BKASH" | "SSLCOMMERZ" | "STRIPE" | "KRISHIPAY";
  escrowReleasedAt?: string;
  escrowTrxId?: string;
  createdAt: string;
}

export interface AuctionBid {
  id: string;
  farmerId: string;
  farmerName: string;
  price: number;
  qty: number;
  time: string;
  message?: string;
}

export interface Auction {
  id: string;
  title: string;
  buyerName: string;
  category: ProductCategory;
  quantityKg: number;
  targetPrice: number;
  district: string;
  deadline: string;
  status: "ACTIVE" | "CLOSED";
  bids: AuctionBid[];
}

export interface ChatMessage {
  id: string;
  sender: "BUYER" | "FARMER";
  senderName: string;
  text: string;
  timestamp: string;
  isOffer?: boolean;
  offerPrice?: number;
  offerQty?: number;
  offerStatus?: "PENDING" | "ACCEPTED" | "COUNTERED" | "REJECTED";
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  action: string;
  resource: string;
  ipAddress: string;
  role: string;
  status: "ALLOWED" | "BLOCKED" | "FLAGGED";
  details: string;
}
