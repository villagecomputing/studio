import React, { useContext } from 'react';
import ExperimentRowInspectorView from './ExperimentRowInspectorView';
import {
  ExperimentRowInspectorContext,
  ExperimentRowInspectorProps,
} from './types';

const ExperimentRowInspectorContext =
  React.createContext<ExperimentRowInspectorContext>(undefined);

export const useExperimentRowInspectorContext = () => {
  const context = useContext(ExperimentRowInspectorContext);
  if (!context) {
    throw new Error(
      'useExperimentRowInspectorContext must be used within a ExperimentRowInspectorContextProvider',
    );
  }
  return context;
};

export default function ExperimentRowInspector(
  props: ExperimentRowInspectorProps,
) {
  return (
    <ExperimentRowInspectorContext.Provider
      value={{
        ...props.context,
      }}
    >
      <ExperimentRowInspectorView />
    </ExperimentRowInspectorContext.Provider>
  );
}
