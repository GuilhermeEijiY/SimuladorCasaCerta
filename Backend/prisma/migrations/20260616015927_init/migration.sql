-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simulations" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "property_value" DECIMAL(12,2) NOT NULL,
    "down_payment" DECIMAL(12,2) NOT NULL,
    "monthly_income" DECIMAL(12,2) NOT NULL,
    "interest_rate" DECIMAL(8,6) NOT NULL,
    "term_months" INTEGER NOT NULL,
    "admin_fee" DECIMAL(8,6) NOT NULL,
    "bid_value" DECIMAL(12,2),
    "objective" TEXT NOT NULL,
    "urgency" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "simulations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financing_results" (
    "id" TEXT NOT NULL,
    "simulation_id" TEXT NOT NULL,
    "financing_type" TEXT NOT NULL,
    "financed_amount" DECIMAL(12,2) NOT NULL,
    "first_installment" DECIMAL(12,2) NOT NULL,
    "last_installment" DECIMAL(12,2) NOT NULL,
    "total_cost" DECIMAL(12,2) NOT NULL,
    "total_interest" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "financing_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consortium_results" (
    "id" TEXT NOT NULL,
    "simulation_id" TEXT NOT NULL,
    "credit_value" DECIMAL(12,2) NOT NULL,
    "monthly_payment" DECIMAL(12,2) NOT NULL,
    "admin_fee_total" DECIMAL(12,2) NOT NULL,
    "bid_value" DECIMAL(12,2) NOT NULL,
    "estimated_contemplation" INTEGER NOT NULL,
    "total_cost" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "consortium_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendations" (
    "id" TEXT NOT NULL,
    "simulation_id" TEXT NOT NULL,
    "recommended_option" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "ai_reason" TEXT,
    "score_financing" DECIMAL(5,2) NOT NULL,
    "score_consortium" DECIMAL(5,2) NOT NULL,
    "savings_estimate" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "consortium_results_simulation_id_key" ON "consortium_results"("simulation_id");

-- CreateIndex
CREATE UNIQUE INDEX "recommendations_simulation_id_key" ON "recommendations"("simulation_id");

-- AddForeignKey
ALTER TABLE "simulations" ADD CONSTRAINT "simulations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financing_results" ADD CONSTRAINT "financing_results_simulation_id_fkey" FOREIGN KEY ("simulation_id") REFERENCES "simulations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consortium_results" ADD CONSTRAINT "consortium_results_simulation_id_fkey" FOREIGN KEY ("simulation_id") REFERENCES "simulations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_simulation_id_fkey" FOREIGN KEY ("simulation_id") REFERENCES "simulations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
