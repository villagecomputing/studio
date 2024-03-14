import { DEFAULT_COLUMN_NAME_PREFIX } from '@/lib/services/ApiUtils/dataset/utils';
import datasetParser from '@/lib/services/DatasetParser';
import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ColumnHeader, UploadDataContextType } from './types';

const UploadDataContext = createContext<UploadDataContextType | undefined>(
  undefined,
);

export const useUploadDataContext = () => {
  const context = useContext(UploadDataContext);
  if (!context) {
    throw new Error('useUploadData must be used within a UploadDataProvider');
  }
  return context;
};

export const UploadDataProvider: React.FC<{
  children: ReactNode;
  refetchData: () => Promise<void>;
}> = ({ children, refetchData }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [columnHeaders, setColumnHeaders] = useState<ColumnHeader[]>([]);
  const [blankGTColumn, setBlankGTColumn] = useState<ColumnHeader>({
    index: -1,
    name: '',
  });

  /**
   * This also works as a reset for the context
   */
  const onFileSelected = async (file: File | null) => {
    if (!file) {
      return;
    }
    const columns = await datasetParser.getHeader(file);
    const currentBlankGTColumn = {
      index: columns.length,
      name: '',
    };
    setBlankGTColumn(currentBlankGTColumn);
    setColumnHeaders([
      currentBlankGTColumn,
      ...columns.map((column, index) => ({
        index,
        name: column || `${DEFAULT_COLUMN_NAME_PREFIX}${index}`,
      })),
    ]);
    setSelectedFile(file);
  };

  useEffect(() => {
    if (!columnHeaders.length || !blankGTColumn) {
      return;
    }
    const updatedColumnHeaders = [...columnHeaders];
    updatedColumnHeaders[0] = blankGTColumn;
    setColumnHeaders(updatedColumnHeaders);
  }, [blankGTColumn]);

  const setBlankGTColumnName = useCallback(
    (name: string) => {
      setBlankGTColumn({
        ...blankGTColumn,
        name,
      });
    },
    [blankGTColumn],
  );

  return (
    <UploadDataContext.Provider
      value={{
        selectedFile,
        columnHeaders,
        onFileSelected,
        blankGTColumn,
        setBlankGTColumnName,
        refetchData,
      }}
    >
      {children}
    </UploadDataContext.Provider>
  );
};
