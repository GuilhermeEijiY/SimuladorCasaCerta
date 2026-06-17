-- AlterTable
ALTER TABLE "consortium_results" ADD COLUMN     "readjustment_estimate" DECIMAL(12,2);

-- AlterTable
ALTER TABLE "financing_results" ADD COLUMN     "savings_with_amortization" DECIMAL(12,2),
ADD COLUMN     "time_saved_months" INTEGER;
