
-- CreateTable
CREATE TABLE "Logs" (
  "uuid" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "pipeline_metadata" TEXT NOT NULL, 
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL,
  "deleted_at" DATETIME,
  "total_latency" REAL NOT NULL DEFAULT 0,
  "latency_p50" REAL NOT NULL DEFAULT 0,
  "latency_p90" REAL NOT NULL DEFAULT 0,
  "total_cost" REAL NOT NULL DEFAULT 0,
  "total_accuracy" REAL NOT NULL DEFAULT 0,
  "total_rows" REAL NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Logs_column" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "logs_uuid" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "field" TEXT NOT NULL,
  "type" TEXT NOT NULL CHECK ( "type" IN (
      'INPUT',
      'OUTPUT',
      'STEP_METADATA',
      'METADATA',
      'IDENTIFIER',
      'TIMESTAMP'
  ) ),
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL,
  "deleted_at" DATETIME,
  CONSTRAINT "logs_column_logs_id_fkey" FOREIGN KEY ("logs_uuid") REFERENCES "Logs" ("uuid") ON DELETE CASCADE ON UPDATE CASCADE
)
