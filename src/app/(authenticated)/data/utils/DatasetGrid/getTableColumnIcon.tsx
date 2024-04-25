import { exhaustiveCheck } from '@/lib/typeUtils';
import { ENUM_Column_type } from '@/lib/types';
import { SparkleIcon } from 'lucide-react';

export function getTableColumnIcon(columnType: ENUM_Column_type) {
  switch (columnType) {
    case ENUM_Column_type.GROUND_TRUTH:
      return <SparkleIcon size={14} />;
    case ENUM_Column_type.INPUT:
    case ENUM_Column_type.GROUND_TRUTH_STATUS:
    case ENUM_Column_type.IDENTIFIER:
    case ENUM_Column_type.METADATA:
    case ENUM_Column_type.TIMESTAMP:
      return null;
    default: {
      return exhaustiveCheck(columnType);
    }
  }
}
