// Offline storage utilities for PWA functionality

interface OfflineTodo {
  id: string;
  action: 'create' | 'update' | 'delete';
  todo?: any;
  timestamp: number;
}

export const offlineStorage = {
  // Add todo to offline queue
  addOfflineTodo: (action: 'create' | 'update' | 'delete', todo?: any) => {
    const offlineTodos = getOfflineTodos();
    const offlineTodo: OfflineTodo = {
      id: crypto.randomUUID(),
      action,
      todo,
      timestamp: Date.now()
    };
    
    offlineTodos.push(offlineTodo);
    localStorage.setItem('offline-todos', JSON.stringify(offlineTodos));
    
    // Register background sync if available
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then(registration => {
        // TypeScript workaround for sync API
        return (registration as any).sync?.register('background-sync-todos');
      }).catch(console.error);
    }
  },

  // Get all offline todos
  getOfflineTodos: () => {
    return getOfflineTodos();
  },

  // Clear offline todos (after successful sync)
  clearOfflineTodos: () => {
    localStorage.removeItem('offline-todos');
  },

  // Check if device is online
  isOnline: () => {
    return navigator.onLine;
  },

  // Cache important data for offline use
  cacheForOffline: (key: string, data: any) => {
    try {
      localStorage.setItem(`offline-cache-${key}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Failed to cache data for offline use:', error);
    }
  },

  // Get cached data
  getCachedData: (key: string, maxAge: number = 24 * 60 * 60 * 1000) => {
    try {
      const cached = localStorage.getItem(`offline-cache-${key}`);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > maxAge) {
        localStorage.removeItem(`offline-cache-${key}`);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to get cached data:', error);
      return null;
    }
  }
};

function getOfflineTodos(): OfflineTodo[] {
  try {
    const stored = localStorage.getItem('offline-todos');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to get offline todos:', error);
    return [];
  }
}