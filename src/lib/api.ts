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
