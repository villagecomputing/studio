import React, { useContext } from 'react';
import { DatasetTableContext } from '../../types';
import DatasetRowInspector from './DatasetRowInspector';
import { DatasetRowInspectorProps } from './types';

const DatasetRowInspectorContext = React.createContext<
  DatasetTableContext | undefined
>(undefined);

export const useDatasetRowInspectorContext = () => {
  const context = useContext(DatasetRowInspectorContext);
  if (!context) {
    throw new Error(
      'useDatasetRowInspectorContext must be used within a DatasetRowInspectorContextProvider',
    );
  }
  return context;
};

export default function DatasetRowInspectorView(
  props: DatasetRowInspectorProps,
) {
  return (
    <DatasetRowInspectorContext.Provider value={props.context}>
      <DatasetRowInspector />
    </DatasetRowInspectorContext.Provider>
  );
}
