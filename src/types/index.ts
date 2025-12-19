/* ======================================================
   USER-RELATED INTERFACES
   ====================================================== */

export interface User {
  id: string;
  name: string;
  email: string;

  role: 'GENERAL' | 'SELLER' | 'PREMIUM_SELLER';
  sellerType: 'NONE' | 'NORMAL' | 'PREMIUM';

  campusId: string;
  university: string;

  rating: number;
  trustScore: number;

  verified: boolean;

  // Backend state
  isSuspended: boolean;

  profilePicture: string;

  totalRatings: number;
  totalTransactions: number;

  isOnline: boolean;
  lastSeen: string;

  createdAt: string;
  updatedAt: string;

  /* ================================
     ADMIN / UI DERIVED FIELDS
     ================================ */

  // Used for admin filtering & badges
  status: 'Active' | 'Suspended';

  // Analytics / moderation
  completedDeals?: number;
  reportsCount?: number;

  // Alias for UI display
  lastActivity?: string;
}

/* ======================================================
   CATEGORY-RELATED INTERFACES
   ====================================================== */

export interface Category {
  id: string;
  name: string;
  expensiveThreshold: number;
  commissionPercent: number;
  requiresVerification: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/* ======================================================
   LISTING-RELATED INTERFACES
   ====================================================== */

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  negotiable: boolean;

  category: string;
  categoryId: string;

  condition: string;
  location: string;

  images: string[];

  seller: string;

  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'SOLD';

  isExpensive: boolean;
  commissionPaid: boolean;
  isFeatured: boolean;

  views: number;
  tags: string[];

  university: string;

  createdAt: string;
  updatedAt: string;
}

/* ======================================================
   DEAL-RELATED INTERFACES
   ====================================================== */

export interface Deal {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;

  agreedPrice: number;

  status: 'PENDING' | 'COMPLETED' | 'DISPUTED';

  buyerConfirmed: boolean;
  sellerConfirmed: boolean;

  createdAt: string;
  updatedAt: string;
}

/* ======================================================
   CHAT-RELATED INTERFACES
   ====================================================== */

export interface Chat {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;

  lastMessage: string;
  unreadCount: number;

  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;

  message: string;
  read: boolean;

  sentAt: string;
}

/* ======================================================
   REVIEW-RELATED INTERFACES
   ====================================================== */

export interface Review {
  id: string;
  listing: string;
  reviewer: string;
  reviewedUser: string;

  rating: number;
  comment: string;

  status: 'active' | 'flagged' | 'removed';

  transactionId?: string;

  createdAt: string;
  updatedAt: string;
}

/* ======================================================
   VERIFICATION-RELATED INTERFACES
   ====================================================== */

export interface VerificationRequest {
  id: string;
  userId: string;

  name: string;
  email: string;

  selfieUrl: string;
  ninUrl: string;

  verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  verifiedAt?: string;

  createdAt: string;
  updatedAt: string;
}
