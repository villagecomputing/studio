-- CreateTable
CREATE TABLE "Dataset" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dataset_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Dataset_column" (
    "id" SERIAL NOT NULL,
    "dataset_uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Dataset_column_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experiment_column" (
    "id" SERIAL NOT NULL,
    "experiment_uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "ground_truth_column_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Experiment_column_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experiment_group" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Experiment_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experiment" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "dataset_uuid" TEXT NOT NULL,
    "created_by" TEXT,
    "group_id" INTEGER NOT NULL,
    "pipeline_metadata" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "total_latency" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "latency_p50" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "latency_p90" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_accuracy" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_rows" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Experiment_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Logs" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_by" TEXT,
    "pipeline_metadata" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "total_latency" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "latency_p50" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "latency_p90" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_accuracy" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_rows" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Logs_column" (
    "id" SERIAL NOT NULL,
    "logs_uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Logs_column_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "API_key" (
    "key" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3),

    CONSTRAINT "API_key_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "User" (
    "uuid" TEXT NOT NULL,
    "external_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_User_2" ON "User"("external_id");

-- AddForeignKey
ALTER TABLE "Dataset" ADD CONSTRAINT "Dataset_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dataset_column" ADD CONSTRAINT "Dataset_column_dataset_uuid_fkey" FOREIGN KEY ("dataset_uuid") REFERENCES "Dataset"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experiment_column" ADD CONSTRAINT "Experiment_column_ground_truth_column_id_fkey" FOREIGN KEY ("ground_truth_column_id") REFERENCES "Dataset_column"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experiment_column" ADD CONSTRAINT "Experiment_column_experiment_uuid_fkey" FOREIGN KEY ("experiment_uuid") REFERENCES "Experiment"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experiment" ADD CONSTRAINT "Experiment_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experiment" ADD CONSTRAINT "Experiment_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Experiment_group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experiment" ADD CONSTRAINT "Experiment_dataset_uuid_fkey" FOREIGN KEY ("dataset_uuid") REFERENCES "Dataset"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logs_column" ADD CONSTRAINT "Logs_column_logs_uuid_fkey" FOREIGN KEY ("logs_uuid") REFERENCES "Logs"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "API_key" ADD CONSTRAINT "API_key_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
