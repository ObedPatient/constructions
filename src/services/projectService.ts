import api from './api';
import type { Project } from '../types';

export const projectService = {
  getAll: () => api.get<Project[]>('/projects'),
  getBySlug: (slug: string) => api.get<Project>(`/projects/${slug}`),
  create: (data: Omit<Project, 'id'>) => api.post<Project>('/projects', data),
  createWithImages: (data: FormData) =>
    api.post<Project>('/projects', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id: string, data: Partial<Project>) => api.put<Project>(`/projects/${id}`, data),
  updateWithImages: (id: string, data: FormData) =>
    api.put<Project>(`/projects/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id: string) => api.delete(`/projects/${id}`),
  uploadImages: (id: string, files: FormData) =>
    api.post<string[]>(`/projects/${id}/images`, files, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};
