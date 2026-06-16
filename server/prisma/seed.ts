import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const APP_CURRENCY = process.env.VITE_APP_CURRENCY ?? 'RWF';

const companyProfile = {
  id: 'default',
  companyName: 'REAL Construction',
  tagline: "Building Rwanda's Future, One Structure at a Time",
  description:
    "REAL Construction is Rwanda's premier construction company, delivering excellence in engineering, architecture, and infrastructure development since 2005. We build landmarks that define skylines and communities that shape lives.",
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

const projects = [
  {
    title: 'Kigali Business Tower',
    slug: 'kigali-business-tower',
    location: 'Kigali, Rwanda',
    category: 'commercial' as const,
    client: 'RwandaInvest Group',
    completionDate: '2024-03',
    description:
      "A landmark 28-story commercial tower in the heart of Kigali's CBD, featuring smart building technology, LEED certification, and 45,000 sqm of premium office space.",
    shortDescription: "A landmark 28-story tower redefining Kigali's skyline with smart tech and sustainability.",
    images: [
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
      'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1200&q=80',
    ],
    coverImage: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80',
    technologies: ['Smart Building Systems', 'LEED Certification', 'Steel & Concrete', 'BIM Design'],
    status: 'completed' as const,
    value: `120M ${APP_CURRENCY}`,
    duration: '36 months',
    featured: true,
  },
  {
    title: 'Kacyiru Residential Estate',
    slug: 'kacyiru-residential-estate',
    location: 'Kacyiru, Kigali',
    category: 'residential' as const,
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
    status: 'completed' as const,
    value: `45M ${APP_CURRENCY}`,
    duration: '24 months',
    featured: true,
  },
  {
    title: 'Nyabarongo River Bridge',
    slug: 'nyabarongo-river-bridge',
    location: 'Nyabarongo, Rwanda',
    category: 'infrastructure' as const,
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
    status: 'completed' as const,
    value: `78M ${APP_CURRENCY}`,
    duration: '30 months',
    featured: true,
  },
  {
    title: 'Bugesera Industrial Park',
    slug: 'bugesera-industrial-park',
    location: 'Bugesera, Rwanda',
    category: 'industrial' as const,
    client: 'Rwanda Development Board',
    completionDate: '2025-12',
    description:
      'A 200-hectare special economic zone with modern factory units, logistics hubs, power infrastructure, and worker amenities.',
    shortDescription: '200-hectare SEZ with industrial units, logistics infrastructure and worker facilities.',
    images: ['https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=1200&q=80'],
    coverImage: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=1200&q=80',
    technologies: ['Industrial Grade', 'Solar Microgrids', 'Wastewater Treatment', 'Smart Logistics'],
    status: 'ongoing' as const,
    value: `250M ${APP_CURRENCY}`,
    duration: '48 months',
    featured: true,
  },
];

const projectCategories = [
  { name: 'Commercial', slug: 'commercial' },
  { name: 'Residential', slug: 'residential' },
  { name: 'Infrastructure', slug: 'infrastructure' },
  { name: 'Renovation', slug: 'renovation' },
  { name: 'Industrial', slug: 'industrial' },
  { name: 'Civil', slug: 'civil' },
];

const services = [
  {
    id: 'service_building',
    title: 'Building Construction',
    description: 'From concept to completion, we build commercial, residential, and mixed-use developments with precision and craftsmanship.',
    icon: 'Building2',
    features: ['Commercial Buildings', 'High-rise Towers', 'Residential Complexes', 'Mixed-use Developments'],
    sortOrder: 1,
  },
  {
    id: 'service_civil',
    title: 'Civil Engineering',
    description: 'Expert civil engineering solutions for roads, bridges, water systems, and large-scale infrastructure projects.',
    icon: 'Layers',
    features: ['Road Construction', 'Bridge Engineering', 'Water Systems', 'Structural Analysis'],
    sortOrder: 2,
  },
  {
    id: 'service_renovation',
    title: 'Renovation & Fit-Out',
    description: 'Transform existing spaces with our expert renovation and interior fit-out services for modern living and working environments.',
    icon: 'Hammer',
    features: ['Interior Renovation', 'Office Fit-Out', 'Historic Restoration', 'Space Redesign'],
    sortOrder: 3,
  },
  {
    id: 'service_infrastructure',
    title: 'Infrastructure Development',
    description: 'Large-scale infrastructure solutions that power communities and drive economic growth across East Africa.',
    icon: 'Network',
    features: ['Industrial Parks', 'Utility Networks', 'Public Infrastructure', 'SEZs'],
    sortOrder: 4,
  },
  {
    id: 'service_management',
    title: 'Project Management',
    description: 'End-to-end project management ensuring timelines, budgets, and quality standards are consistently met.',
    icon: 'ClipboardList',
    features: ['Budget Management', 'Quality Control', 'Risk Assessment', 'Timeline Tracking'],
    sortOrder: 5,
  },
  {
    id: 'service_consultancy',
    title: 'Engineering Consultancy',
    description: 'Strategic engineering consultancy to help clients navigate complex construction challenges with confidence.',
    icon: 'Lightbulb',
    features: ['Feasibility Studies', 'Design Review', 'Technical Audits', 'Advisory Services'],
    sortOrder: 6,
  },
];

const milestones = [
  { id: 'milestone_2005', year: '2005', title: 'Founded', description: 'REAL Construction established with a team of 12 engineers and a bold vision.', sortOrder: 1 },
  { id: 'milestone_2008', year: '2008', title: 'First Major Contract', description: `Awarded the Kigali Northern Bypass infrastructure contract worth 15M ${APP_CURRENCY}.`, sortOrder: 2 },
  { id: 'milestone_2012', year: '2012', title: 'Regional Expansion', description: 'Extended operations to Uganda and Tanzania, growing to 200 employees.', sortOrder: 3 },
  { id: 'milestone_2016', year: '2016', title: 'ISO Certification', description: 'Achieved ISO 9001:2015 certification for quality management systems.', sortOrder: 4 },
  { id: 'milestone_2019', year: '2019', title: '200th Project', description: 'Completed our 200th project - the Kigali Heights mixed-use development.', sortOrder: 5 },
  { id: 'milestone_2024', year: '2024', title: 'Industry Leader', description: "340+ completed projects, 500+ team members, East Africa's most trusted builder.", sortOrder: 6 },
];

const teamMembers = [
  {
    id: 'team_jean_pierre',
    name: 'Jean-Pierre Habimana',
    role: 'Chief Executive Officer',
    bio: '20+ years leading transformative construction projects across East Africa with a focus on sustainable development.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
    linkedin: '#',
    sortOrder: 1,
  },
  {
    id: 'team_aline',
    name: 'Aline Uwimana',
    role: 'Chief Engineering Officer',
    bio: 'Structural engineer with deep expertise in high-rise construction and infrastructure development.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    linkedin: '#',
    sortOrder: 2,
  },
  {
    id: 'team_emmanuel',
    name: 'Emmanuel Nkurunziza',
    role: 'Head of Architecture',
    bio: 'Award-winning architect known for blending modern aesthetics with African vernacular design principles.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80',
    linkedin: '#',
    sortOrder: 3,
  },
  {
    id: 'team_diane',
    name: 'Diane Mukashyaka',
    role: 'Director of Operations',
    bio: 'Operations specialist ensuring every project meets the highest standards of quality, safety, and efficiency.',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&q=80',
    linkedin: '#',
    sortOrder: 4,
  },
];

const partners = [
  {
    id: 'partner_world_bank',
    name: 'World Bank',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/87/The_World_Bank_logo.svg',
    website: 'https://www.worldbank.org',
    sortOrder: 1,
  },
  {
    id: 'partner_afdb',
    name: 'African Development Bank',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/African_Development_Bank_logo.svg',
    website: 'https://www.afdb.org',
    sortOrder: 2,
  },
  {
    id: 'partner_giz',
    name: 'GIZ Germany',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/GIZ-logo.svg',
    website: 'https://www.giz.de',
    sortOrder: 3,
  },
  {
    id: 'partner_rdb',
    name: 'Rwanda Development Board',
    logo: null,
    website: 'https://rdb.rw',
    sortOrder: 4,
  },
  {
    id: 'partner_usaid',
    name: 'USAID',
    logo: null,
    website: 'https://www.usaid.gov',
    sortOrder: 5,
  },
  {
    id: 'partner_un_habitat',
    name: 'UN Habitat',
    logo: null,
    website: 'https://unhabitat.org',
    sortOrder: 6,
  },
];

async function main() {
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD ?? 'admin123', 12);

  await prisma.adminUser.upsert({
    where: { email: process.env.ADMIN_EMAIL ?? 'admin@real.rw' },
    update: {
      name: process.env.ADMIN_NAME ?? 'Admin User',
      passwordHash,
    },
    create: {
      name: process.env.ADMIN_NAME ?? 'Admin User',
      email: process.env.ADMIN_EMAIL ?? 'admin@real.rw',
      passwordHash,
      role: 'admin',
    },
  });

  await prisma.companyProfile.upsert({
    where: { id: 'default' },
    update: companyProfile,
    create: companyProfile,
  });

  for (const category of projectCategories) {
    await prisma.projectCategory.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.id },
      update: service,
      create: service,
    });
  }

  for (const milestone of milestones) {
    await prisma.milestone.upsert({
      where: { id: milestone.id },
      update: milestone,
      create: milestone,
    });
  }

  for (const member of teamMembers) {
    await prisma.teamMember.upsert({
      where: { id: member.id },
      update: member,
      create: member,
    });
  }

  for (const partner of partners) {
    await prisma.partner.upsert({
      where: { id: partner.id },
      update: partner,
      create: partner,
    });
  }

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
