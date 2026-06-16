import api from './api';
import type { ContactMessage } from '../types';

export const contactService = {
  submit: (data: Omit<ContactMessage, 'id' | 'createdAt' | 'isRead'>) =>
    api.post('/contact', data),
  getAll: () => api.get<ContactMessage[]>('/contact/messages'),
  markRead: (id: string) => api.patch(`/contact/messages/${id}/read`),
  delete: (id: string) => api.delete(`/contact/messages/${id}`),
};
