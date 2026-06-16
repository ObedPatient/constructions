import api from './api';
import type { ProjectCategory } from '../types';

export const projectCategoryService = {
  getAll: () => api.get<ProjectCategory[]>('/project-categories'),
  create: (data: Pick<ProjectCategory, 'name'> & { slug?: string }) =>
    api.post<ProjectCategory>('/project-categories', data),
  update: (id: string, data: Partial<Pick<ProjectCategory, 'name' | 'slug'>>) =>
    api.put<ProjectCategory>(`/project-categories/${id}`, data),
  delete: (id: string) => api.delete(`/project-categories/${id}`),
};
