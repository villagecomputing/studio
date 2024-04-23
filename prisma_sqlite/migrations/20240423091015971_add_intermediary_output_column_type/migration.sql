-- CreateTempTable
CREATE TABLE "Logs_column_new" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "logs_uuid" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "field" TEXT NOT NULL,
  "type" TEXT NOT NULL CHECK ( "type" IN (
      'INPUT',
      'OUTPUT',
      'INTERMEDIARY_OUTPUT',
      'STEP_METADATA',
      'METADATA',
      'IDENTIFIER',
      'TIMESTAMP'
  ) ),
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL,
  "deleted_at" DATETIME,
  CONSTRAINT "logs_column_logs_id_fkey" FOREIGN KEY ("logs_uuid") REFERENCES "Logs" ("uuid") ON DELETE CASCADE ON UPDATE CASCADE
);
-- CopyContent
INSERT INTO "Logs_column_new" SELECT * FROM "Logs_column";
-- DropOldTable
DROP TABLE "Logs_column";
-- RenameNewTable
ALTER TABLE "Logs_column_new" RENAME TO "Logs_column";

-- CreateTempTable
CREATE TABLE "Experiment_column_new" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "experiment_uuid" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "field" TEXT NOT NULL,
  "type" TEXT NOT NULL CHECK ( "type" IN (
      'INPUT',
      'OUTPUT',
      'INTERMEDIARY_OUTPUT',
      'STEP_METADATA',
      'METADATA',
      'IDENTIFIER'
  ) ),
  "ground_truth_column_id" INTEGER,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL,
  "deleted_at" DATETIME,
  CONSTRAINT "experiment_column_experiment_id_fkey" FOREIGN KEY ("experiment_uuid") REFERENCES "Experiment" ("uuid") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "experiment_column_ground_truth_id_fkey" FOREIGN KEY ("ground_truth_column_id") REFERENCES "Dataset_column" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
-- CreateTable
INSERT INTO "Experiment_column_new" SELECT * FROM "Experiment_column";
-- DropOldTable
DROP TABLE "Experiment_column";
-- RenameNewTable
ALTER TABLE "Experiment_column_new" RENAME TO "Experiment_column";
