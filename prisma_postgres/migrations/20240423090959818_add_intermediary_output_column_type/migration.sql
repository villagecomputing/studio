ALTER TABLE "Experiment_column"
DROP CONSTRAINT "experiment_column_type_check_constraint";

ALTER TABLE "Experiment_column"
ADD CONSTRAINT "experiment_column_type_check_constraint"
CHECK ( "type" IN ('INPUT', 'OUTPUT', 'INTERMEDIARY_OUTPUT', 'STEP_METADATA', 'METADATA', 'IDENTIFIER'));

ALTER TABLE "Logs_column"
DROP CONSTRAINT "logs_column_type_check_constraint";

ALTER TABLE "Logs_column"
ADD CONSTRAINT "logs_column_type_check_constraint"
CHECK ( "type" IN ('INPUT', 'OUTPUT', 'INTERMEDIARY_OUTPUT', 'STEP_METADATA', 'METADATA', 'IDENTIFIER', 'TIMESTAMP'));