import api from './api';
import type { CompanyProfile } from '../types';

export const companyService = {
  get: () => api.get<CompanyProfile>('/company'),
  update: (data: Partial<CompanyProfile>) => api.put<CompanyProfile>('/company', data),
  uploadLogo: (file: FormData) =>
    api.post<{ url: string }>('/company/logo', file, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  uploadHeroImage: (file: FormData) =>
    api.post<{ url: string }>('/company/hero-image', file, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};
