ALTER TABLE "Dataset_column"
ADD CONSTRAINT "dataset_column_type_check_constraint"
CHECK ("type" IN ('GROUND_TRUTH', 'GROUND_TRUTH_STATUS', 'INPUT', 'IDENTIFIER'));

ALTER TABLE "Experiment_column"
ADD CONSTRAINT "experiment_column_type_check_constraint"
CHECK ( "type" IN ('INPUT', 'OUTPUT', 'STEP_METADATA', 'METADATA', 'IDENTIFIER'));

ALTER TABLE "Logs_column"
ADD CONSTRAINT "logs_column_type_check_constraint"
CHECK ( "type" IN ('INPUT', 'OUTPUT', 'STEP_METADATA', 'METADATA', 'IDENTIFIER', 'TIMESTAMP'));
