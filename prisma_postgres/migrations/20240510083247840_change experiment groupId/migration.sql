-- DropForeignKey
ALTER TABLE "Experiment" DROP CONSTRAINT "Experiment_group_id_fkey";

-- AlterTable
ALTER TABLE "Experiment" ALTER COLUMN "group_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Experiment_group" DROP CONSTRAINT "Experiment_group_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Experiment_group_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Experiment_group_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Experiment_group_id_key" ON "Experiment_group"("id");

-- AddForeignKey
ALTER TABLE "Experiment" ADD CONSTRAINT "Experiment_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Experiment_group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

