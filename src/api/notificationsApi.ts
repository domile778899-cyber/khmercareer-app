export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'job' | 'course' | 'promo' | 'system';
  read: boolean;
  createdAt: string;
}

const KEY = 'khmercareer_notifications';

function getAll(): Notification[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

function save(items: Notification[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export const notificationsApi = {
  getAll: () => getAll(),
  getUnread: () => getAll().filter(n => !n.read),
  getUnreadCount: () => getAll().filter(n => !n.read).length,
  create: (data: Omit<Notification, 'id' | 'createdAt'>) => {
    const items = getAll();
    const newItem: Notification = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    items.unshift(newItem);
    save(items);
    return newItem;
  },
  markAsRead: (id: string) => {
    const items = getAll();
    const idx = items.findIndex(i => i.id === id);
    if (idx !== -1) {
      items[idx] = { ...items[idx], read: true };
      save(items);
    }
  },
  markAllAsRead: () => {
    save(getAll().map(n => ({ ...n, read: true })));
  },
  delete: (id: string) => {
    save(getAll().filter(n => n.id !== id));
  },
  clearAll: () => {
    save([]);
  },
};
