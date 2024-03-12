/*
  Warnings:

  - You are about to drop the `Dataset` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Dataset_column` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ground_truth_cell` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Log_user_action` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Dataset";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Dataset_column";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Ground_truth_cell";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Log_user_action";
PRAGMA foreign_keys=on;
