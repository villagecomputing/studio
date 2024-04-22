import { Button } from '@/components/ui/button';
import { Enum_Experiment_Column_Type } from '@/lib/types';
import React from 'react';
import { RAW_DATA_SECTION } from '../ExperimentRowInspectorView';
import { RowInspectorHeaderStepsProps } from '../types';

export const RowInspectorHeaderSteps: React.FC<
  RowInspectorHeaderStepsProps
> = ({ onStepSelected, columnDefs }) => {
  const metadataColumns = columnDefs.filter(
    (colDef) => colDef.type === Enum_Experiment_Column_Type.STEP_METADATA,
  );

  return (
    <div className="mt-4 flex space-x-2">
      <Button
        variant={'ghost'}
        onClick={() => onStepSelected(RAW_DATA_SECTION)}
      >
        Raw Data
      </Button>
      {metadataColumns.map((colDef) => {
        if (!colDef.headerName || !colDef.field) {
          return <></>;
        }
        const stepName = colDef.headerName.replace(/^_+|_+$/g, '').trim();
        return (
          <Button
            variant={'ghost'}
            key={colDef.field}
            onClick={() => onStepSelected(colDef.field!)}
          >
            {stepName}
          </Button>
        );
      })}
    </div>
  );
};
