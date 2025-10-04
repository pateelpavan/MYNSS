// Performance-optimized data management for handling 100+ concurrent users
import { NSSUser, AdminEvent, Suggestion } from '../App';

// Cache configuration
const CACHE_CONFIG = {
  maxSize: 1000, // Maximum number of items in cache
  ttl: 5 * 60 * 1000, // 5 minutes TTL
  maxMemoryUsage: 50 * 1024 * 1024, // 50MB max memory usage
};

interface CacheItem<T> {
  data: T;
  timestamp: number;
  size: number;
}

class DataManager {
  private cache = new Map<string, CacheItem<any>>();
  private memoryUsage = 0;
  private isProcessing = false;
  private queue: Array<() => Promise<void>> = [];

  // Debounced localStorage operations to prevent blocking
  private debouncedSave = this.debounce(this.saveToStorage.bind(this), 1000);

  // Memory-efficient data operations
  async getUsers(page = 0, limit = 50): Promise<NSSUser[]> {
    const cacheKey = `users_${page}_${limit}`;
    const cached = this.getFromCache<NSSUser[]>(cacheKey);
    if (cached) return cached;

    const allUsers = this.getFromStorage<NSSUser[]>('nss-users') || [];
    const paginatedUsers = allUsers.slice(page * limit, (page + 1) * limit);
    
    this.setCache(cacheKey, paginatedUsers);
    return paginatedUsers;
  }

  async getAllUsers(): Promise<NSSUser[]> {
    const cached = this.getFromCache<NSSUser[]>('all_users');
    if (cached) return cached;

    const users = this.getFromStorage<NSSUser[]>('nss-users') || [];
    this.setCache('all_users', users);
    return users;
  }

  async saveUser(user: NSSUser): Promise<void> {
    return this.queueOperation(async () => {
      const users = await this.getAllUsers();
      const existingIndex = users.findIndex(u => u.id === user.id);
      
      if (existingIndex >= 0) {
        users[existingIndex] = user;
      } else {
        users.push(user);
      }
      
      await this.saveUsers(users);
      this.invalidateCache('users');
      this.invalidateCache('all_users');
    });
  }

  async saveUsers(users: NSSUser[]): Promise<void> {
    return this.queueOperation(async () => {
      this.saveToStorage('nss-users', users);
      this.invalidateCache('users');
      this.invalidateCache('all_users');
    });
  }

  async getEvents(): Promise<AdminEvent[]> {
    const cached = this.getFromCache<AdminEvent[]>('events');
    if (cached) return cached;

    const events = this.getFromStorage<AdminEvent[]>('nss-admin-events') || [];
    this.setCache('events', events);
    return events;
  }

  async saveEvent(event: AdminEvent): Promise<void> {
    return this.queueOperation(async () => {
      const events = await this.getEvents();
      const existingIndex = events.findIndex(e => e.id === event.id);
      
      if (existingIndex >= 0) {
        events[existingIndex] = event;
      } else {
        events.push(event);
      }
      
      this.saveToStorage('nss-admin-events', events);
      this.invalidateCache('events');
    });
  }

  async getSuggestions(): Promise<Suggestion[]> {
    const cached = this.getFromCache<Suggestion[]>('suggestions');
    if (cached) return cached;

    const suggestions = this.getFromStorage<Suggestion[]>('nss-suggestions') || [];
    this.setCache('suggestions', suggestions);
    return suggestions;
  }

  async saveSuggestion(suggestion: Suggestion): Promise<void> {
    return this.queueOperation(async () => {
      const suggestions = await this.getSuggestions();
      const existingIndex = suggestions.findIndex(s => s.id === suggestion.id);
      
      if (existingIndex >= 0) {
        suggestions[existingIndex] = suggestion;
      } else {
        suggestions.push(suggestion);
      }
      
      this.saveToStorage('nss-suggestions', suggestions);
      this.invalidateCache('suggestions');
    });
  }

  // Optimized search with pagination
  async searchUsers(query: string, page = 0, limit = 20): Promise<NSSUser[]> {
    const cacheKey = `search_${query}_${page}_${limit}`;
    const cached = this.getFromCache<NSSUser[]>(cacheKey);
    if (cached) return cached;

    const allUsers = await this.getAllUsers();
    const filtered = allUsers.filter(user => 
      user.fullName.toLowerCase().includes(query.toLowerCase()) ||
      user.rollNumber.toLowerCase().includes(query.toLowerCase()) ||
      user.branch.toLowerCase().includes(query.toLowerCase())
    );
    
    const paginated = filtered.slice(page * limit, (page + 1) * limit);
    this.setCache(cacheKey, paginated);
    return paginated;
  }

  // Memory management
  private getFromCache<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check TTL
    if (Date.now() - item.timestamp > CACHE_CONFIG.ttl) {
      this.cache.delete(key);
      this.memoryUsage -= item.size;
      return null;
    }

    return item.data;
  }

  private setCache<T>(key: string, data: T): void {
    const size = this.calculateSize(data);
    
    // Check memory limits
    if (this.memoryUsage + size > CACHE_CONFIG.maxMemoryUsage) {
      this.cleanupCache();
    }

    // Check cache size limits
    if (this.cache.size >= CACHE_CONFIG.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      size
    });
    
    this.memoryUsage += size;
  }

  private invalidateCache(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        const item = this.cache.get(key);
        if (item) {
          this.memoryUsage -= item.size;
        }
        this.cache.delete(key);
      }
    }
  }

  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > CACHE_CONFIG.ttl) {
        this.memoryUsage -= item.size;
        this.cache.delete(key);
      }
    }
  }

  private evictOldest(): void {
    let oldestKey = '';
    let oldestTime = Date.now();
    
    for (const [key, item] of this.cache.entries()) {
      if (item.timestamp < oldestTime) {
        oldestTime = item.timestamp;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      const item = this.cache.get(oldestKey);
      if (item) {
        this.memoryUsage -= item.size;
      }
      this.cache.delete(oldestKey);
    }
  }

  private calculateSize(data: any): number {
    return JSON.stringify(data).length * 2; // Rough estimate
  }

  // Queue operations to prevent concurrent localStorage access
  private async queueOperation(operation: () => Promise<void>): Promise<void> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          await operation();
          resolve();
        } catch (error) {
          reject(error);
        }
      });
      
      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) return;
    
    this.isProcessing = true;
    
    while (this.queue.length > 0) {
      const operation = this.queue.shift();
      if (operation) {
        try {
          await operation();
        } catch (error) {
          console.error('Queue operation failed:', error);
        }
      }
    }
    
    this.isProcessing = false;
  }

  // Optimized localStorage operations
  private getFromStorage<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  private saveToStorage(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      // Handle storage quota exceeded
      if (error.name === 'QuotaExceededError') {
        this.handleStorageQuotaExceeded();
      }
    }
  }

  private handleStorageQuotaExceeded(): void {
    // Clear old cache data
    this.cleanupCache();
    
    // Try to compress data or remove old entries
    const users = this.getFromStorage<NSSUser[]>('nss-users') || [];
    if (users.length > 1000) {
      // Keep only recent 1000 users
      const recentUsers = users
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 1000);
      this.saveToStorage('nss-users', recentUsers);
    }
  }

  // Utility functions
  private debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  // Public cleanup method
  clearCache(): void {
    this.cache.clear();
    this.memoryUsage = 0;
  }

  // Get cache statistics
  getCacheStats(): { size: number; memoryUsage: number; hitRate: number } {
    return {
      size: this.cache.size,
      memoryUsage: this.memoryUsage,
      hitRate: 0 // Could be implemented with hit/miss counters
    };
  }
}

// Export singleton instance
export const dataManager = new DataManager();
export default dataManager;

