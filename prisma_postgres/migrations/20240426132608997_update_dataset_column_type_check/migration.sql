ALTER TABLE "Dataset_column"
DROP CONSTRAINT "dataset_column_type_check_constraint";

ALTER TABLE "Dataset_column"
ADD CONSTRAINT "dataset_column_type_check_constraint"
CHECK ( "type" IN ('GROUND_TRUTH', 'GROUND_TRUTH_STATUS', 'INPUT', 'IDENTIFIER', 'TIMESTAMP', 'METADATA'));