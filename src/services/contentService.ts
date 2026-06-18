import api from './api';
import type { HeroSlide, Milestone, Partner, Service, TeamMember } from '../types';

const multipart = { headers: { 'Content-Type': 'multipart/form-data' } };

export const serviceContentService = {
  getAll: () => api.get<Service[]>('/services'),
  create: (data: Omit<Service, 'id'> | FormData) =>
    api.post<Service>('/services', data, data instanceof FormData ? multipart : undefined),
  update: (id: string, data: Partial<Omit<Service, 'id'>> | FormData) =>
    api.put<Service>(`/services/${id}`, data, data instanceof FormData ? multipart : undefined),
  delete: (id: string) => api.delete(`/services/${id}`),
};

export const milestoneService = {
  getAll: () => api.get<Milestone[]>('/milestones'),
  create: (data: Omit<Milestone, 'id'>) => api.post<Milestone>('/milestones', data),
  update: (id: string, data: Partial<Omit<Milestone, 'id'>>) => api.put<Milestone>(`/milestones/${id}`, data),
  delete: (id: string) => api.delete(`/milestones/${id}`),
};

export const teamService = {
  getAll: () => api.get<TeamMember[]>('/team'),
  create: (data: Omit<TeamMember, 'id'> | FormData) =>
    api.post<TeamMember>('/team', data, data instanceof FormData ? multipart : undefined),
  update: (id: string, data: Partial<Omit<TeamMember, 'id'>> | FormData) =>
    api.put<TeamMember>(`/team/${id}`, data, data instanceof FormData ? multipart : undefined),
  delete: (id: string) => api.delete(`/team/${id}`),
};

export const partnerService = {
  getAll: () => api.get<Partner[]>('/partners'),
  create: (data: Omit<Partner, 'id'> | FormData) =>
    api.post<Partner>('/partners', data, data instanceof FormData ? multipart : undefined),
  update: (id: string, data: Partial<Omit<Partner, 'id'>> | FormData) =>
    api.put<Partner>(`/partners/${id}`, data, data instanceof FormData ? multipart : undefined),
  delete: (id: string) => api.delete(`/partners/${id}`),
};

export const heroSlideService = {
  getAll: () => api.get<HeroSlide[]>('/hero-slides'),
  create: (data: Omit<HeroSlide, 'id'>) => api.post<HeroSlide>('/hero-slides', data),
  update: (id: string, data: Partial<Omit<HeroSlide, 'id'>>) => api.put<HeroSlide>(`/hero-slides/${id}`, data),
  delete: (id: string) => api.delete(`/hero-slides/${id}`),
};
