-- AlterTable
ALTER TABLE "simulations" ADD COLUMN     "chart_data" JSONB,
ADD COLUMN     "decisive_factor" TEXT,
ADD COLUMN     "recommendation_factors" JSONB,
ADD COLUMN     "scenarios" JSONB;
