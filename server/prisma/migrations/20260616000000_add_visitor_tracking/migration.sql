-- CreateTable "Visitor"
CREATE TABLE "Visitor" (
    "id" TEXT NOT NULL,
    "userAgent" TEXT,
    "referer" TEXT,
    "path" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Visitor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Visitor_timestamp_idx" ON "Visitor"("timestamp");
