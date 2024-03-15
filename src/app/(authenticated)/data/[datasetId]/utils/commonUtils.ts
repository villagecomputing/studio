import { ENUM_Column_type, ENUM_Ground_truth_status } from '@/lib/types';

import { ObjectParseResult } from '@/lib/services/DatasetParser';
import { AGGridDataset, DatasetRow, GroundTruthCell } from '../types';

export const ROW_ID_FIELD_NAME = 'ROW_ID';
export const GROUND_TRUTH_COLUMN_SUFFIX = ' (GT)';

export function getColumnFieldFromNameAndIndex(
  columnName: string,
  index: number,
): string {
  const sanitizedColumnName = columnName
    .replaceAll(/[^a-zA-Z0-9_]/g, '_')
    .toLowerCase();
  return `${sanitizedColumnName.toLowerCase()}_${index}`;
}

export function isGroundTruthCell(
  value: DatasetRow[string],
): value is GroundTruthCell {
  return (
    typeof value === 'object' &&
    value !== null &&
    'content' in value &&
    'status' in value &&
    'id' in value &&
    Object.values(ENUM_Ground_truth_status).includes(
      value.status as ENUM_Ground_truth_status,
    )
  );
}

export function mapFieldNameToHeaderName(
  row: DatasetRow,
  columnDefs: AGGridDataset['columnDefs'],
): ObjectParseResult['rows'][number] {
  // Create a mapping from field names to header names, appending '(GT)' to the header name
  // if the column type is GROUND_TRUTH.
  const headerNameMap = columnDefs.reduce<{
    [key: string]: string | undefined;
  }>((acc, { field, headerName, type }) => {
    if (field) {
      acc[field] =
        type === ENUM_Column_type.GROUND_TRUTH
          ? `${headerName}${GROUND_TRUTH_COLUMN_SUFFIX}`
          : headerName;
    }
    return acc;
  }, {});

  // Transform the row object to map its field names to the corresponding header names
  // defined in the headerNameMap. If the cell content is a ground truth cell, use its content.
  // Exclude the ROW_ID_FIELD_NAME when creating the new row object.
  return Object.keys(row)
    .filter((key) => key !== ROW_ID_FIELD_NAME)
    .reduce<{ [key: string]: string }>((acc, key) => {
      let cellContent = row[key];
      // If the cell i
      if (isGroundTruthCell(cellContent)) {
        cellContent = cellContent.content;
      }
      // Map the field name to the header name, defaulting to the field name if no header name is found.
      const newKey = headerNameMap[key] || key;
      acc[newKey] = cellContent;
      return acc;
    }, {});
}
