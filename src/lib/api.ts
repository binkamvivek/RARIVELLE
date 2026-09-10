// ============================================================
//  RARIVELLE — Frontend API Client
//  After deploying your Apps Script Web App, paste the URL below.
// ============================================================

export const API_URL =
  'https://script.google.com/macros/s/AKfycbwYTQgSLAYHRt8qvShC7YZ0hA6Ny12uC79hsqfatx5ZTh1e4hhR2DvhkHlMVzadCaK6/exec';

// ------ Types ------

export interface RarivelleUser {
  userId: string;
  name: string;
  email: string;
  createdAt: string;
}

interface ApiResponse<T = RarivelleUser> {
  success: boolean;
  data?: T;
  error?: string;
}

// ------ LocalStorage helpers ------

const USER_KEY = 'rarivelle_user';

export function getCurrentUser(): RarivelleUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: RarivelleUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearCurrentUser(): void {
  localStorage.removeItem(USER_KEY);
}

// ------ API calls ------

export async function signup(
  name: string,
  email: string,
  password: string
): Promise<ApiResponse> {
  const res = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'signup', name, email, password }),
  });
  return res.json();
}

export async function login(
  email: string,
  password: string
): Promise<ApiResponse> {
  const res = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'login', email, password }),
  });
  return res.json();
}

export async function getUser(userId: string): Promise<ApiResponse> {
  const url = `${API_URL}?action=getUser&userId=${encodeURIComponent(userId)}`;
  const res = await fetch(url);
  return res.json();
}

// ------ Products / Listings (Phase 2B) ------

export interface RarivelleProduct {
  productId: string;
  sellerId: string;
  sellerName: string;
  title: string;
  category: string;
  description: string;
  price: number;
  condition: string;
  brand: string;
  year: string;
  location: string;
  images: string[];
  status: 'active' | 'sold' | 'delisted';
  createdAt: string;
  provenance?: string;
}

export interface ProductInput {
  sellerId: string;
  title: string;
  category?: string;
  description?: string;
  price: number;
  condition?: string;
  brand?: string;
  year?: string;
  location?: string;
  images?: string[];
  provenance?: string;
}

export async function getProducts(params?: {
  sellerId?: string;
  status?: string;
}): Promise<{ success: boolean; data?: RarivelleProduct[]; error?: string }> {
  const q = new URLSearchParams({ action: 'getProducts' });
  // Default to active listings (discover). Pass status 'all' for history.
  q.set('status', params?.status ?? 'active');
  if (params?.sellerId) q.set('sellerId', params.sellerId);
  const res = await fetch(`${API_URL}?${q.toString()}`);
  return res.json();
}

export async function getProduct(
  productId: string
): Promise<{ success: boolean; data?: RarivelleProduct; error?: string }> {
  const url = `${API_URL}?action=getProduct&productId=${encodeURIComponent(productId)}`;
  const res = await fetch(url);
  return res.json();
}

export async function createProduct(
  input: ProductInput
): Promise<{ success: boolean; data?: RarivelleProduct; error?: string }> {
  const res = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'createProduct', ...input }),
  });
  return res.json();
}

export async function updateProduct(
  productId: string,
  sellerId: string,
  updates: Partial<Omit<ProductInput, 'sellerId'> & { status: string }>
): Promise<{ success: boolean; data?: RarivelleProduct; error?: string }> {
  const res = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'updateProduct', productId, sellerId, ...updates }),
  });
  return res.json();
}

// Soft-delete: flips status to "delisted", preserving history.
export async function deleteProduct(
  productId: string,
  sellerId: string
): Promise<{ success: boolean; data?: RarivelleProduct; error?: string }> {
  const res = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'deleteProduct', productId, sellerId }),
  });
  return res.json();
}

// Keep only http(s) image URLs — never send data-URL/base64 to Sheets.
export function sanitizeImageUrls(urls: (string | null | undefined)[]): string[] {
  return urls
    .map((u) => (u || '').trim())
    .filter((u) => /^https?:\/\/.+/i.test(u))
    .slice(0, 8);
}

// ------ Wishlist (Phase 2C, per-user) ------

export interface RarivelleWishlistItem {
  wishlistId: string;
  userId: string;
  productId: string;
  createdAt: string;
  product: RarivelleProduct;
}

export async function getWishlist(
  userId: string
): Promise<{ success: boolean; data?: RarivelleWishlistItem[]; error?: string }> {
  const url = `${API_URL}?action=getWishlist&userId=${encodeURIComponent(userId)}`;
  const res = await fetch(url);
  return res.json();
}

export async function addWishlist(
  userId: string,
  productId: string
): Promise<{ success: boolean; data?: RarivelleWishlistItem; error?: string }> {
  const res = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'addWishlist', userId, productId }),
  });
  return res.json();
}

export async function removeWishlist(
  userId: string,
  productId: string
): Promise<{ success: boolean; data?: { productId: string }; error?: string }> {
  const res = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'removeWishlist', userId, productId }),
  });
  return res.json();
}

// ------ Seller Profiles (Phase 2D, public) ------

export interface RarivelleSellerProfile {
  userId: string;
  name: string;
  avatarUrl: string;
  location: string;
  bio: string;
  rating: string;
  verified: boolean;
  memberSince: string;
  stats: {
    activeListings: number;
    totalValuation: number;
  };
  listings: RarivelleProduct[];
}

export interface ProfileUpdateInput {
  name?: string;
  avatarUrl?: string;
  location?: string;
  bio?: string;
}

export async function getSellerProfile(
  userId: string
): Promise<{ success: boolean; data?: RarivelleSellerProfile; error?: string }> {
  const url = `${API_URL}?action=getSellerProfile&userId=${encodeURIComponent(userId)}`;
  const res = await fetch(url);
  return res.json();
}

export async function updateProfile(
  userId: string,
  updates: ProfileUpdateInput
): Promise<{ success: boolean; data?: RarivelleSellerProfile; error?: string }> {
  const res = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'updateProfile', userId, ...updates }),
  });
  return res.json();
}

// ------ Messaging (Phase 2E) ------

export interface RarivelleMessage {
  messageId: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  productId: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface RarivelleConversation {
  conversationId: string;
  productId: string;
  productTitle: string;
  productImage: string;
  counterpartId: string;
  counterpartName: string;
  lastMessage: string;
  lastTimestamp: string;
  lastSenderId: string;
  unreadCount: number;
}

export function buildConversationId(productId: string, buyerId: string): string {
  return `${productId}|${buyerId}`;
}

export async function sendMessage(
  senderId: string,
  receiverId: string,
  productId: string,
  message: string
): Promise<{ success: boolean; data?: RarivelleMessage; error?: string }> {
  const res = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'sendMessage', senderId, receiverId, productId, message }),
  });
  return res.json();
}

export async function getConversations(
  userId: string
): Promise<{ success: boolean; data?: RarivelleConversation[]; error?: string }> {
  const url = `${API_URL}?action=getConversations&userId=${encodeURIComponent(userId)}`;
  const res = await fetch(url);
  return res.json();
}

export async function getMessages(
  conversationId: string,
  userId: string
): Promise<{ success: boolean; data?: RarivelleMessage[]; error?: string }> {
  const url = `${API_URL}?action=getMessages&conversationId=${encodeURIComponent(conversationId)}&userId=${encodeURIComponent(userId)}`;
  const res = await fetch(url);
  return res.json();
}

export async function markRead(
  conversationId: string,
  userId: string
): Promise<{ success: boolean; data?: { marked: number }; error?: string }> {
  const res = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'markRead', conversationId, userId }),
  });
  return res.json();
}
