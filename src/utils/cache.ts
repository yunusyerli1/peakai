interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes in milliseconds

export class Cache {
  private static getKey(url: string): string {
    return `cache_${btoa(url)}`;
  }

  static get<T>(url: string): T | null {
    const key = this.getKey(url);
    const cached = localStorage.getItem(key);
    
    if (!cached) return null;

    try {
      const { data, timestamp }: CacheItem<T> = JSON.parse(cached);
      
      // Check if cache is expired
      if (Date.now() - timestamp > CACHE_EXPIRY) {
        localStorage.removeItem(key);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Cache parse error:', error);
      return null;
    }
  }

  static set<T>(url: string, data: T): void {
    const key = this.getKey(url);
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
    };

    try {
      localStorage.setItem(key, JSON.stringify(cacheItem));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  static clear(): void {
    // Clear only cache items
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('cache_')) {
        localStorage.removeItem(key);
      }
    });
  }
} 