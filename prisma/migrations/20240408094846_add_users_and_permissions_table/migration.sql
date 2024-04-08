-- SQLite compatible changes to the migration file
CREATE TABLE "User" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "external_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" TEXT
);

CREATE TABLE "API_key" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    CONSTRAINT "API_key_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Experiment_User_Permissions" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "experiment_id" TEXT NOT NULL, 
    "permission" TEXT NOT NULL CHECK ("permission" IN ('CREATE', 'EDIT', 'VIEW')),
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    CONSTRAINT "Experiment_User_Permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Experiment_User_Permissions_experiment_id_fkey" FOREIGN KEY ("experiment_id") REFERENCES "Experiment"("uuid") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Dataset_User_Permissions" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "dataset_id" TEXT NOT NULL, 
    "permission" TEXT NOT NULL CHECK ("permission" IN ('CREATE', 'EDIT', 'VIEW')),
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    CONSTRAINT "Dataset_User_Permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Dataset_User_Permissions_dataset_id_fkey" FOREIGN KEY ("dataset_id") REFERENCES "Dataset"("uuid") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Log_User_Permissions" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "log_id" TEXT NOT NULL, 
    "permission" TEXT NOT NULL CHECK ("permission" IN ('CREATE', 'EDIT', 'VIEW')),
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    CONSTRAINT "Log_User_Permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Log_User_Permissions_log_id_fkey" FOREIGN KEY ("log_id") REFERENCES "Logs"("uuid") ON DELETE CASCADE ON UPDATE CASCADE
);
