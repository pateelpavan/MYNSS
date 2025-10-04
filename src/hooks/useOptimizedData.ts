// Performance-optimized React hooks for handling large datasets
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { NSSUser, AdminEvent, Suggestion } from '../App';
import dataManager from '../utils/dataManager';

// Pagination configuration
const PAGINATION_CONFIG = {
  defaultPageSize: 20,
  maxPageSize: 100,
  prefetchPages: 2, // Prefetch next 2 pages
};

// Loading states
interface LoadingState {
  isLoading: boolean;
  error: string | null;
  progress?: number;
}

// Pagination state
interface PaginationState {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

// Optimized users hook with pagination and virtualization
export function useOptimizedUsers() {
  const [users, setUsers] = useState<NSSUser[]>([]);
  const [loading, setLoading] = useState<LoadingState>({ isLoading: true, error: null });
  const [pagination, setPagination] = useState<PaginationState>({
    page: 0,
    limit: PAGINATION_CONFIG.defaultPageSize,
    total: 0,
    hasMore: true
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  // Load users with pagination
  const loadUsers = useCallback(async (page: number = 0, limit: number = PAGINATION_CONFIG.defaultPageSize) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setLoading({ isLoading: true, error: null, progress: 0 });

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setLoading(prev => ({ 
          ...prev, 
          progress: Math.min((prev.progress || 0) + 10, 90) 
        }));
      }, 100);

      const [usersData, totalUsers] = await Promise.all([
        dataManager.getUsers(page, limit),
        dataManager.getAllUsers().then(all => all.length)
      ]);

      clearInterval(progressInterval);

      if (abortControllerRef.current?.signal.aborted) return;

      setUsers(prevUsers => {
        if (page === 0) {
          return usersData;
        }
        // Merge with existing data, avoiding duplicates
        const existingIds = new Set(prevUsers.map(u => u.id));
        const newUsers = usersData.filter(u => !existingIds.has(u.id));
        return [...prevUsers, ...newUsers];
      });

      setPagination({
        page,
        limit,
        total: totalUsers,
        hasMore: (page + 1) * limit < totalUsers
      });

      setLoading({ isLoading: false, error: null, progress: 100 });

      // Prefetch next pages
      if (page + 1 < Math.ceil(totalUsers / limit)) {
        setTimeout(() => {
          for (let i = 1; i <= PAGINATION_CONFIG.prefetchPages; i++) {
            const nextPage = page + i;
            if (nextPage * limit < totalUsers) {
              dataManager.getUsers(nextPage, limit);
            }
          }
        }, 1000);
      }

    } catch (error) {
      if (abortControllerRef.current?.signal.aborted) return;
      
      setLoading({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to load users' 
      });
    }
  }, []);

  // Load more users
  const loadMore = useCallback(() => {
    if (!loading.isLoading && pagination.hasMore) {
      loadUsers(pagination.page + 1, pagination.limit);
    }
  }, [loading.isLoading, pagination.hasMore, pagination.page, pagination.limit, loadUsers]);

  // Refresh users
  const refresh = useCallback(() => {
    dataManager.clearCache();
    loadUsers(0, pagination.limit);
  }, [loadUsers, pagination.limit]);

  // Search users with debouncing
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NSSUser[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setSearchLoading(true);
      try {
        const results = await dataManager.searchUsers(query, 0, 50);
        setSearchResults(results);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setSearchLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  // Initial load
  useEffect(() => {
    loadUsers();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadUsers]);

  // Memoized computed values
  const approvedUsers = useMemo(() => 
    users.filter(u => u.isApproved), [users]
  );

  const pendingUsers = useMemo(() => 
    users.filter(u => !u.isApproved && !u.isRejected), [users]
  );

  const rejectedUsers = useMemo(() => 
    users.filter(u => u.isRejected), [users]
  );

  return {
    users,
    searchResults,
    searchQuery,
    setSearchQuery,
    loading,
    searchLoading,
    pagination,
    approvedUsers,
    pendingUsers,
    rejectedUsers,
    loadMore,
    refresh,
    saveUser: dataManager.saveUser,
    getAllUsers: dataManager.getAllUsers
  };
}

// Optimized events hook
export function useOptimizedEvents() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState<LoadingState>({ isLoading: true, error: null });

  const loadEvents = useCallback(async () => {
    try {
      setLoading({ isLoading: true, error: null });
      const eventsData = await dataManager.getEvents();
      setEvents(eventsData);
      setLoading({ isLoading: false, error: null });
    } catch (error) {
      setLoading({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to load events' 
      });
    }
  }, []);

  const saveEvent = useCallback(async (event: AdminEvent) => {
    try {
      await dataManager.saveEvent(event);
      setEvents(prev => {
        const existingIndex = prev.findIndex(e => e.id === event.id);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = event;
          return updated;
        }
        return [...prev, event];
      });
    } catch (error) {
      console.error('Failed to save event:', error);
      throw error;
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return {
    events,
    loading,
    saveEvent,
    refresh: loadEvents
  };
}

// Optimized suggestions hook
export function useOptimizedSuggestions() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState<LoadingState>({ isLoading: true, error: null });

  const loadSuggestions = useCallback(async () => {
    try {
      setLoading({ isLoading: true, error: null });
      const suggestionsData = await dataManager.getSuggestions();
      setSuggestions(suggestionsData);
      setLoading({ isLoading: false, error: null });
    } catch (error) {
      setLoading({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to load suggestions' 
      });
    }
  }, []);

  const saveSuggestion = useCallback(async (suggestion: Suggestion) => {
    try {
      await dataManager.saveSuggestion(suggestion);
      setSuggestions(prev => {
        const existingIndex = prev.findIndex(s => s.id === suggestion.id);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = suggestion;
          return updated;
        }
        return [...prev, suggestion];
      });
    } catch (error) {
      console.error('Failed to save suggestion:', error);
      throw error;
    }
  }, []);

  useEffect(() => {
    loadSuggestions();
  }, [loadSuggestions]);

  return {
    suggestions,
    loading,
    saveSuggestion,
    refresh: loadSuggestions
  };
}

// Virtual scrolling hook for large lists
export function useVirtualScrolling<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );

    return {
      items: items.slice(startIndex, endIndex),
      startIndex,
      endIndex,
      totalHeight: items.length * itemHeight,
      offsetY: startIndex * itemHeight
    };
  }, [items, itemHeight, containerHeight, scrollTop]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    handleScroll
  };
}

// Debounce utility
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Performance monitoring hook
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    memoryUsage: 0,
    cacheStats: { size: 0, memoryUsage: 0, hitRate: 0 }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Monitor memory usage
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMetrics(prev => ({
          ...prev,
          memoryUsage: memory.usedJSHeapSize / 1024 / 1024, // MB
          cacheStats: dataManager.getCacheStats()
        }));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const measureRender = useCallback((fn: () => void) => {
    const start = performance.now();
    fn();
    const end = performance.now();
    setMetrics(prev => ({ ...prev, renderTime: end - start }));
  }, []);

  return { metrics, measureRender };
}

