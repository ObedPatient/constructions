import type { Project, CompanyProfile, NavItem, Stat } from '../types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Services', href: '/services',
    children: [
      { label: 'Building Construction', href: '/services#service_building' },
      { label: 'Civil Engineering', href: '/services#service_civil' },
      { label: 'Renovation', href: '/services#service_renovation' },
      { label: 'Infrastructure', href: '/services#service_infrastructure' },
    ],
  },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact', href: '/contact' },
];
export const COMPANY_PROFILE: CompanyProfile = {
  companyName: 'Builders max construction ltd',
  tagline: 'Building Rwanda\'s Future, One Structure at a Time',
  description:
    'Builders max construction ltd is Rwanda\'s premier construction company, delivering excellence in engineering, architecture, and infrastructure development since 2005. We build landmarks that define skylines and communities that shape lives.',
  mission:
    'To deliver world-class construction solutions that exceed client expectations through innovation, quality craftsmanship, and sustainable practices.',
  vision:
    'To be the most trusted and innovative construction company in East Africa, setting the benchmark for quality and excellence.',
  phone: '+250 788 000 000',
  email: 'info@real.rw',
  address: 'KG 7 Ave, Kigali Business Center, Kigali, Rwanda',
  socialLinks: {
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
  },
  foundedYear: 2005,
  projectsCompleted: 340,
  clientsSatisfied: 280,
  yearsExperience: 20,
  awardsWon: 45,
};

export const STATS: Stat[] = [
  { label: 'Projects Completed', value: 340, suffix: '+' },
  { label: 'Satisfied Clients', value: 280, suffix: '+' },
  { label: 'Years Experience', value: 20, suffix: '' },
  { label: 'Awards Won', value: 45, suffix: '' },
];

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Kigali Business Tower',
    slug: 'kigali-business-tower',
    location: 'Kigali, Rwanda',
    category: 'commercial',
    client: 'RwandaInvest Group',
    completionDate: '2024-03',
    description:
      'A landmark 28-story commercial tower in the heart of Kigali\'s CBD, featuring smart building technology, LEED certification, and 45,000 sqm of premium office space.',
    shortDescription: 'A landmark 28-story tower redefining Kigali\'s skyline with smart tech and sustainability.',
    images: [
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
      'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1200&q=80',
    ],
    coverImage: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80',
    technologies: ['Smart Building Systems', 'LEED Certification', 'Steel & Concrete', 'BIM Design'],
    status: 'completed',
    value: '$120M',
    duration: '36 months',
    featured: true,
  },
  {
    id: '2',
    title: 'Kacyiru Residential Estate',
    slug: 'kacyiru-residential-estate',
    location: 'Kacyiru, Kigali',
    category: 'residential',
    client: 'Housing Authority of Rwanda',
    completionDate: '2023-11',
    description:
      'An award-winning residential development comprising 450 modern units with green spaces, communal facilities, and sustainable design principles.',
    shortDescription: '450-unit modern residential estate with green spaces and sustainable design.',
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
    ],
    coverImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80',
    technologies: ['Green Architecture', 'Solar Panels', 'Rainwater Harvesting', 'Smart Security'],
    status: 'completed',
    value: '$45M',
    duration: '24 months',
    featured: true,
  },
  {
    id: '3',
    title: 'Nyabarongo River Bridge',
    slug: 'nyabarongo-river-bridge',
    location: 'Nyabarongo, Rwanda',
    category: 'infrastructure',
    client: 'Rwanda Infrastructure Authority',
    completionDate: '2024-06',
    description:
      'A 380-meter cable-stayed bridge spanning the Nyabarongo River, connecting two major economic zones and reducing transit time by 40%.',
    shortDescription: 'A 380m cable-stayed bridge connecting two economic zones across Nyabarongo River.',
    images: [
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80',
      'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1200&q=80',
    ],
    coverImage: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80',
    technologies: ['Cable-stayed Design', 'Seismic Resistant', 'Advanced Materials', 'Digital Monitoring'],
    status: 'completed',
    value: '$78M',
    duration: '30 months',
    featured: true,
  },
  {
    id: '4',
    title: 'Kigali Convention Center Annex',
    slug: 'kcc-annex',
    location: 'Kigali, Rwanda',
    category: 'commercial',
    client: 'Rwanda Convention Bureau',
    completionDate: '2025-01',
    description:
      'An 8,000 sqm annex to the iconic KCC featuring flexible conference spaces, modern AV systems, and seamless integration with the main venue.',
    shortDescription: '8,000 sqm convention annex with flexible spaces and modern technology integration.',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
    ],
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
    technologies: ['AV Integration', 'Modular Design', 'Energy Efficient', 'Smart Controls'],
    status: 'completed',
    value: '$32M',
    duration: '18 months',
    featured: false,
  },
  {
    id: '5',
    title: 'Bugesera Industrial Park',
    slug: 'bugesera-industrial-park',
    location: 'Bugesera, Rwanda',
    category: 'industrial',
    client: 'Rwanda Development Board',
    completionDate: '2025-12',
    description:
      'A 200-hectare special economic zone with modern factory units, logistics hubs, power infrastructure, and worker amenities.',
    shortDescription: '200-hectare SEZ with industrial units, logistics infrastructure and worker facilities.',
    images: [
      'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=1200&q=80',
    ],
    coverImage: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=1200&q=80',
    technologies: ['Industrial Grade', 'Solar Microgrids', 'Wastewater Treatment', 'Smart Logistics'],
    status: 'ongoing',
    value: '$250M',
    duration: '48 months',
    featured: true,
  },
  {
    id: '6',
    title: 'Musanze Hotel & Spa',
    slug: 'musanze-hotel-spa',
    location: 'Musanze, Rwanda',
    category: 'commercial',
    client: 'RwandaTourism Investments',
    completionDate: '2024-09',
    description:
      'A luxury 5-star eco-lodge hotel in the Virunga foothills, harmoniously integrated with the natural environment and Rwandan cultural aesthetics.',
    shortDescription: 'Luxury eco-lodge with stunning Virunga views and locally inspired architectural design.',
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80',
    ],
    coverImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80',
    technologies: ['Eco Construction', 'Local Materials', 'Solar Power', 'Rainforest Design'],
    status: 'completed',
    value: '$18M',
    duration: '20 months',
    featured: false,
  },
];

export const TESTIMONIALS = [
  {
    id: '1',
    name: 'James Kagabo',
    company: 'RwandaInvest Group',
    role: 'CEO',
    content:
      'Builders max construction ltd delivered our tower on time and within budget. The quality of their work is unmatched — they transformed our vision into a landmark that we\'re extremely proud of.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
  },
  {
    id: '2',
    name: 'Marie-Claire Ishimwe',
    company: 'Housing Authority of Rwanda',
    role: 'Director',
    content:
      'The Kacyiru Residential Estate project exceeded every expectation. Builders max construction ltd\'s attention to detail, sustainability focus, and community engagement made them the ideal partner.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
  },
  {
    id: '3',
    name: 'Patrick Nzabonimana',
    company: 'Rwanda Infrastructure Authority',
    role: 'Project Director',
    content:
      'The Nyabarongo Bridge project was extraordinarily complex. Builders max construction ltd navigated every challenge with exceptional skill and delivered a world-class structure.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
  },
];

