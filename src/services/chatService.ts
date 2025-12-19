import { apiCall } from '../utils/api';

// Chat API service
export const chatAPI = {
  // Get reported chats with filters
  getReportedChats: async (filters: any = {}) => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    
    const queryString = params.toString();
    const response = await apiCall(`/admin/messages/reported${queryString ? '?' + queryString : ''}`);
    
    if (!response) return null;
    return await response.json();
  },
  
  // Flag a user for chat moderation
  flagUser: async (userId: string, reason: string) => {
    const response = await apiCall('/admin/users/flag', {
      method: 'POST',
      body: JSON.stringify({ userId, reason }),
    });
    
    if (!response) return null;
    return await response.json();
  },
  
  // Mute a user temporarily
  muteUser: async (userId: string, duration: string, reason: string) => {
    const response = await apiCall('/admin/users/mute', {
      method: 'POST',
      body: JSON.stringify({ userId, duration, reason }),
    });
    
    if (!response) return null;
    return await response.json();
  },
  
  // Ban a user
  banUser: async (userId: string, reason: string) => {
    const response = await apiCall('/admin/users/ban', {
      method: 'POST',
      body: JSON.stringify({ userId, reason }),
    });
    
    if (!response) return null;
    return await response.json();
  },
  
  // Get chat messages between users
  getChatMessages: async (userId1: string, userId2: string) => {
    const response = await apiCall(`/admin/messages/chat/${userId1}/${userId2}`);
    if (!response) return null;
    return await response.json();
  },
};