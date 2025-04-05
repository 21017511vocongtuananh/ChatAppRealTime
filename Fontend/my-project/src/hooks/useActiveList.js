import ApiService from '../services/apis';
import { create } from 'zustand';

const useActiveList = create((set) => ({
  members: [],
  add: (id) => set((state) => ({ members: [...state.members, id] })),
  remove: (id) =>
    set((state) => ({
      members: state.members.filter((memberId) => memberId !== id)
    })),
  set: (ids) => set({ members: ids }),
  fetchOnlineUsers: async () => {
    try {
      const response = await ApiService.getOnlineUser();
      set({ members: response.data });
    } catch (error) {
      console.error('Error fetching online users:', error);
    }
  }
}));

export default useActiveList;
