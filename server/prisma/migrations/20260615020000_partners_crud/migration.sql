CREATE TABLE "Partner" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "logo" TEXT,
  "website" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

INSERT INTO "Partner" ("id", "name", "logo", "website", "sortOrder", "updatedAt") VALUES
  ('partner_world_bank', 'World Bank', 'https://upload.wikimedia.org/wikipedia/commons/8/87/The_World_Bank_logo.svg', 'https://www.worldbank.org', 1, CURRENT_TIMESTAMP),
  ('partner_afdb', 'African Development Bank', 'https://upload.wikimedia.org/wikipedia/commons/e/e6/African_Development_Bank_logo.svg', 'https://www.afdb.org', 2, CURRENT_TIMESTAMP),
  ('partner_giz', 'GIZ Germany', 'https://upload.wikimedia.org/wikipedia/commons/f/f3/GIZ-logo.svg', 'https://www.giz.de', 3, CURRENT_TIMESTAMP),
  ('partner_rdb', 'Rwanda Development Board', NULL, 'https://rdb.rw', 4, CURRENT_TIMESTAMP),
  ('partner_usaid', 'USAID', NULL, 'https://www.usaid.gov', 5, CURRENT_TIMESTAMP),
  ('partner_un_habitat', 'UN Habitat', NULL, 'https://unhabitat.org', 6, CURRENT_TIMESTAMP);
