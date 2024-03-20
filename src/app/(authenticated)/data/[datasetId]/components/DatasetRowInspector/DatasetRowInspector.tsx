import React, { useContext, useEffect, useState } from 'react';
import { GroundTruthCell } from '../../types';
import DatasetRowInspectorView from './DatasetRowInspectorView';
import { DatasetRowInspectorContext, DatasetRowInspectorProps } from './types';

const DatasetRowInspectorContext =
  React.createContext<DatasetRowInspectorContext>(undefined);

export const useDatasetRowInspectorContext = () => {
  const context = useContext(DatasetRowInspectorContext);
  if (!context) {
    throw new Error(
      'useDatasetRowInspectorContext must be used within a DatasetRowInspectorContextProvider',
    );
  }
  return context;
};

export default function DatasetRowInspector(props: DatasetRowInspectorProps) {
  const {
    context: { inspectorRowIndex, rows, groundTruthColumnField },
  } = props;
  const [groundTruthInputValue, setGroundTruthInputValue] =
    useState<string>('');

  useEffect(() => {
    if (inspectorRowIndex === null || !groundTruthColumnField) {
      return;
    }
    setGroundTruthInputValue(
      (rows[inspectorRowIndex][groundTruthColumnField] as GroundTruthCell)
        .content,
    );
  }, [inspectorRowIndex, groundTruthColumnField]);
  return (
    <DatasetRowInspectorContext.Provider
      value={{
        ...props.context,
        groundTruthInputValue,
        setGroundTruthInputValue,
      }}
    >
      <DatasetRowInspectorView />
    </DatasetRowInspectorContext.Provider>
  );
}
