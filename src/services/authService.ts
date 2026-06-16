import api from './api';
import type { AdminUser } from '../types';

export const authService = {
  login: (email: string, password: string) =>
    api.post<{ user: AdminUser; token: string }>('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  me: () => api.get<AdminUser>('/auth/me'),
};
