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
