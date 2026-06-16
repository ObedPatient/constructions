CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "features" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "image" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "linkedin" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

INSERT INTO "Service" ("id", "title", "description", "icon", "features", "sortOrder", "updatedAt")
VALUES
  ('service_building', 'Building Construction', 'From concept to completion, we build commercial, residential, and mixed-use developments with precision and craftsmanship.', 'Building2', ARRAY['Commercial Buildings','High-rise Towers','Residential Complexes','Mixed-use Developments'], 1, CURRENT_TIMESTAMP),
  ('service_civil', 'Civil Engineering', 'Expert civil engineering solutions for roads, bridges, water systems, and large-scale infrastructure projects.', 'Layers', ARRAY['Road Construction','Bridge Engineering','Water Systems','Structural Analysis'], 2, CURRENT_TIMESTAMP),
  ('service_renovation', 'Renovation & Fit-Out', 'Transform existing spaces with our expert renovation and interior fit-out services for modern living and working environments.', 'Hammer', ARRAY['Interior Renovation','Office Fit-Out','Historic Restoration','Space Redesign'], 3, CURRENT_TIMESTAMP),
  ('service_infrastructure', 'Infrastructure Development', 'Large-scale infrastructure solutions that power communities and drive economic growth across East Africa.', 'Network', ARRAY['Industrial Parks','Utility Networks','Public Infrastructure','SEZs'], 4, CURRENT_TIMESTAMP),
  ('service_management', 'Project Management', 'End-to-end project management ensuring timelines, budgets, and quality standards are consistently met.', 'ClipboardList', ARRAY['Budget Management','Quality Control','Risk Assessment','Timeline Tracking'], 5, CURRENT_TIMESTAMP),
  ('service_consultancy', 'Engineering Consultancy', 'Strategic engineering consultancy to help clients navigate complex construction challenges with confidence.', 'Lightbulb', ARRAY['Feasibility Studies','Design Review','Technical Audits','Advisory Services'], 6, CURRENT_TIMESTAMP);

INSERT INTO "Milestone" ("id", "year", "title", "description", "sortOrder", "updatedAt")
VALUES
  ('milestone_2005', '2005', 'Founded', 'REAL Construction established with a team of 12 engineers and a bold vision.', 1, CURRENT_TIMESTAMP),
  ('milestone_2008', '2008', 'First Major Contract', 'Awarded the Kigali Northern Bypass infrastructure contract worth 15M RWF.', 2, CURRENT_TIMESTAMP),
  ('milestone_2012', '2012', 'Regional Expansion', 'Extended operations to Uganda and Tanzania, growing to 200 employees.', 3, CURRENT_TIMESTAMP),
  ('milestone_2016', '2016', 'ISO Certification', 'Achieved ISO 9001:2015 certification for quality management systems.', 4, CURRENT_TIMESTAMP),
  ('milestone_2019', '2019', '200th Project', 'Completed our 200th project - the Kigali Heights mixed-use development.', 5, CURRENT_TIMESTAMP),
  ('milestone_2024', '2024', 'Industry Leader', '340+ completed projects, 500+ team members, East Africa''s most trusted builder.', 6, CURRENT_TIMESTAMP);

INSERT INTO "TeamMember" ("id", "name", "role", "bio", "image", "linkedin", "sortOrder", "updatedAt")
VALUES
  ('team_jean_pierre', 'Jean-Pierre Habimana', 'Chief Executive Officer', '20+ years leading transformative construction projects across East Africa with a focus on sustainable development.', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80', '#', 1, CURRENT_TIMESTAMP),
  ('team_aline', 'Aline Uwimana', 'Chief Engineering Officer', 'Structural engineer with deep expertise in high-rise construction and infrastructure development.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80', '#', 2, CURRENT_TIMESTAMP),
  ('team_emmanuel', 'Emmanuel Nkurunziza', 'Head of Architecture', 'Award-winning architect known for blending modern aesthetics with African vernacular design principles.', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80', '#', 3, CURRENT_TIMESTAMP),
  ('team_diane', 'Diane Mukashyaka', 'Director of Operations', 'Operations specialist ensuring every project meets the highest standards of quality, safety, and efficiency.', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&q=80', '#', 4, CURRENT_TIMESTAMP);
