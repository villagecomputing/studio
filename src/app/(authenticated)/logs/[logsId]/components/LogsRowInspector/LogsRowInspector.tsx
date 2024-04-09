import React, { useContext } from 'react';
import LogsRowInspectorView from './LogsRowInspectorView';
import { LogsRowInspectorContext, LogsRowInspectorProps } from './types';

const LogsRowInspectorContext =
  React.createContext<LogsRowInspectorContext>(undefined);

export const useLogsRowInspectorContext = () => {
  const context = useContext(LogsRowInspectorContext);
  if (!context) {
    throw new Error(
      'useLogsRowInspectorContext must be used within a LogsRowInspectorContextProvider',
    );
  }
  return context;
};

export default function LogsRowInspector(props: LogsRowInspectorProps) {
  return (
    <LogsRowInspectorContext.Provider
      value={{
        ...props.context,
      }}
    >
      <LogsRowInspectorView />
    </LogsRowInspectorContext.Provider>
  );
}
