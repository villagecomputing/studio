-- CreateTable
CREATE TABLE "Experiment_group" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Experiment" (
  "uuid" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "dataset_uuid" TEXT NOT NULL,
  "group_id" INTEGER NOT NULL,
  "pipeline_metadata" TEXT NOT NULL, 
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL,
  "deleted_at" DATETIME,
  CONSTRAINT "experiments_dataset_id_fkey" FOREIGN KEY ("dataset_uuid") REFERENCES "Dataset" ("uuid") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "experiment_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Experiment_group" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
  CONSTRAINT "experiment_column_experiment_id_fkey" FOREIGN KEY ("experiment_uuid") REFERENCES "Experiment" ("uuid") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "experiment_column_ground_truth_id_fkey" FOREIGN KEY ("ground_truth_column_id") REFERENCES "Dataset_column" ("id") ON DELETE SET NULL ON UPDATE CASCADE
)
