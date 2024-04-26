-- AlterTable
ALTER TABLE "Logs" ADD COLUMN     "dataset_uuid" TEXT;

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_dataset_id_fkey" FOREIGN KEY ("dataset_uuid") REFERENCES "Dataset"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "Dataset" ADD COLUMN     "logs_uuid" TEXT;

-- AddForeignKey
ALTER TABLE "Dataset" ADD CONSTRAINT "Dataset_logs_id_fkey" FOREIGN KEY ("logs_uuid") REFERENCES "Logs"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

