-- Convert the old enum-backed project category to text so categories can be managed at runtime.
ALTER TYPE "ProjectCategory" RENAME TO "ProjectCategoryEnum";
ALTER TABLE "Project" ALTER COLUMN "category" TYPE TEXT USING "category"::TEXT;
DROP TYPE "ProjectCategoryEnum";

CREATE TABLE "ProjectCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectCategory_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ProjectCategory_slug_key" ON "ProjectCategory"("slug");

INSERT INTO "ProjectCategory" ("id", "name", "slug", "updatedAt")
VALUES
  ('category_commercial', 'Commercial', 'commercial', CURRENT_TIMESTAMP),
  ('category_residential', 'Residential', 'residential', CURRENT_TIMESTAMP),
  ('category_infrastructure', 'Infrastructure', 'infrastructure', CURRENT_TIMESTAMP),
  ('category_renovation', 'Renovation', 'renovation', CURRENT_TIMESTAMP),
  ('category_industrial', 'Industrial', 'industrial', CURRENT_TIMESTAMP),
  ('category_civil', 'Civil', 'civil', CURRENT_TIMESTAMP)
ON CONFLICT ("slug") DO NOTHING;
