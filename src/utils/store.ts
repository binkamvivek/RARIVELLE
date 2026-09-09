import { INITIAL_COLLECTIBLES, type Collectible } from '../data/collectibles';

export const WISHLIST_STORAGE_KEY = 'rarivelle_wishlist';
export const CUSTOM_LISTINGS_KEY = 'rarivelle_custom_listings';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getClientWishlist(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : ['rv-101', 'rv-104']; // default curated favorites
  } catch (e) {
    return [];
  }
}

export function toggleClientWishlist(id: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const list = getClientWishlist();
    const index = list.indexOf(id);
    let added = false;
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(id);
      added = true;
    }
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('rarivelle:wishlist-updated', { detail: { id, added, count: list.length } }));
    return added;
  } catch (e) {
    return false;
  }
}

export function isClientWishlisted(id: string): boolean {
  if (typeof window === 'undefined') return false;
  return getClientWishlist().includes(id);
}

export function getClientCustomListings(): Collectible[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CUSTOM_LISTINGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveClientCustomListing(listing: Collectible): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getClientCustomListings();
    const updated = [listing, ...existing];
    localStorage.setItem(CUSTOM_LISTINGS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('rarivelle:listing-created', { detail: listing }));
  } catch (e) {
    console.error('Failed to save listing to localStorage', e);
  }
}

export function getMergedCollectibles(): Collectible[] {
  const custom = getClientCustomListings();
  return [...custom, ...INITIAL_COLLECTIBLES];
}
