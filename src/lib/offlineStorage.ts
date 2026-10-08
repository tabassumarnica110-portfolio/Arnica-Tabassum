/**
 * KrishiLink Offline State & Data Caching Utility
 * Enables rural farmers in remote char areas to store product entries and agricultural guides locally
 */

export interface OfflineProductQueueItem {
  id: string;
  name: string;
  banglaName: string;
  category: string;
  quantityKg: number;
  pricePerKg: number;
  timestamp: number;
  synced: boolean;
}

const OFFLINE_QUEUE_KEY = 'krishilink_offline_product_queue';
const OFFLINE_GUIDES_KEY = 'krishilink_cached_agri_guides';

export const offlineStorage = {
  // Save new crop listing while offline
  saveOfflineProduct(product: Omit<OfflineProductQueueItem, 'id' | 'timestamp' | 'synced'>): OfflineProductQueueItem {
    const queue = this.getOfflineProducts();
    const newItem: OfflineProductQueueItem = {
      ...product,
      id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: Date.now(),
      synced: false
    };
    queue.push(newItem);
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
    return newItem;
  },

  // Get all pending offline products
  getOfflineProducts(): OfflineProductQueueItem[] {
    try {
      const data = localStorage.getItem(OFFLINE_QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  // Mark items as synced
  markSynced(ids: string[]) {
    const queue = this.getOfflineProducts().map(item => {
      if (ids.includes(item.id)) {
        return { ...item, synced: true };
      }
      return item;
    });
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  },

  // Clear synced queue
  clearSynced() {
    const queue = this.getOfflineProducts().filter(item => !item.synced);
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  },

  // Offline agricultural guidance cache
  cacheAgriGuidance(category: string, content: any) {
    try {
      const current = JSON.parse(localStorage.getItem(OFFLINE_GUIDES_KEY) || '{}');
      current[category] = { content, updatedAt: Date.now() };
      localStorage.setItem(OFFLINE_GUIDES_KEY, JSON.stringify(current));
    } catch (e) {
      console.warn('LocalStorage error while caching guide:', e);
    }
  },

  getCachedAgriGuidance(category: string) {
    try {
      const current = JSON.parse(localStorage.getItem(OFFLINE_GUIDES_KEY) || '{}');
      return current[category]?.content || null;
    } catch {
      return null;
    }
  }
};
