-- CreateTable
CREATE TABLE "Dataset" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "file_name" TEXT NOT NULL,
    "file_location" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "total_rows" INTEGER NOT NULL,
    "deleted_at" DATETIME
);

-- CreateTable
CREATE TABLE "Dataset_column" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataset_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "dataType" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "deleted_at" DATETIME,
    "index" INTEGER NOT NULL,
    CONSTRAINT "Dataset_column_dataset_id_fkey" FOREIGN KEY ("dataset_id") REFERENCES "Dataset" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Ground_truth_cell" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "column_id" INTEGER NOT NULL,
    CONSTRAINT "Ground_truth_cell_column_id_fkey" FOREIGN KEY ("column_id") REFERENCES "Dataset_column" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Log_user_action" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER,
    "action" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Column" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dataset_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "type" TEXT NOT NULL CHECK ( "type" IN (
        'GROUND_TRUTH',
        'PREDICTIVE_LABEL',
        'INPUT'
    ) ),
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    CONSTRAINT "Column_dataset_id_fkey" FOREIGN KEY ("dataset_id") REFERENCES "Dataset_list" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Dataset_list" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" DATETIME,
    "updated_at" DATETIME NOT NULL
);
