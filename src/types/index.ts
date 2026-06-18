export interface Project {
  id: string;
  title: string;
  slug: string;
  location: string;
  category: string;
  client: string;
  completionDate: string;
  description: string;
  shortDescription: string;
  images: string[];
  coverImage: string;
  technologies: string[];
  status: 'completed' | 'ongoing' | 'upcoming';
  value?: string;
  duration?: string;
  featured?: boolean;
}

export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  image?: string;
  sortOrder?: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin?: string;
  sortOrder?: number;
}

export interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
  sortOrder?: number;
}

export interface Partner {
  id: string;
  name: string;
  logo?: string | null;
  website?: string | null;
  sortOrder?: number;
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  role: string;
  content: string;
  rating: number;
  image?: string;
}

export interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface CompanyProfile {
  companyName: string;
  tagline: string;
  description: string;
  mission: string;
  vision: string;
  phone: string;
  email: string;
  address: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
  logo?: string;
  heroImage?: string;
  foundedYear: number;
  projectsCompleted: number;
  clientsSatisfied: number;
  yearsExperience: number;
  awardsWon: number;
}

export interface AuthState {
  user: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
}

export interface DashboardStats {
  totalProjects: number;
  totalMessages: number;
  unreadMessages: number;
  projectsByCategory: { category: string; count: number }[];
  monthlyVisitors: { month: string; visitors: number }[];
}

export interface Stat {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}
