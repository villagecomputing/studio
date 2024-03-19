-- CreateTable
CREATE TABLE "Experiment_list" (
  "uuid" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "dataset_id" INTEGER NOT NULL,
  "pipeline_metadata" TEXT NOT NULL, 
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL,
  "deleted_at" DATETIME,
  CONSTRAINT "experiments_dataset_id_fkey" FOREIGN KEY ("dataset_id") REFERENCES "Dataset_list" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Experiment_column" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "experiment_uuid" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "field" TEXT NOT NULL,
  "type" TEXT NOT NULL CHECK ( "type" IN (
      'INPUT',
      'OUTPUT',
      'METADATA',
      'IDENTIFIER'
  ) ),
  "ground_truth_column_id" INTEGER,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL,
  "deleted_at" DATETIME,
  CONSTRAINT "experiment_column_experiment_id_fkey" FOREIGN KEY ("experiment_uuid") REFERENCES "Experiment_list" ("uuid") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "experiment_column_ground_truth_id_fkey" FOREIGN KEY ("ground_truth_column_id") REFERENCES "Dataset_column" ("id") ON DELETE SET NULL ON UPDATE CASCADE
)