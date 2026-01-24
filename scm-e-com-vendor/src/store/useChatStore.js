import { create } from 'zustand';
import api from '../api';

const useChatStore = create((set) => ({
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: Number(count) || 0 }),
  refreshUnreadCount: async () => {
    try {
      const res = await api.get('/chat/unread-count');
      set({ unreadCount: Number(res.data?.unread_count) || 0 });
    } catch {
      // ignore (user may be logged out or backend down)
    }
  },
}));

export default useChatStore;

