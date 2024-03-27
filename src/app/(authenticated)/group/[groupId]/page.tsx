'use client';
import Breadcrumb from '@/components/Breadcrumb';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import DataTable from '../../components/data-table/DataTable';
import { DEFAULT_GRID_OPTIONS } from '../../components/data-table/constants';
import { DatasetName } from '../../experiment/components/DatasetNameCellRenderer';
import { useExperimentListContext } from '../../experiment/components/ExperimentListProvider';
import ExperimentGrid from '../../experiment/utils/ExperimentGrid';
import { useGroupSpecificData } from './hooks/useGroupSpecificData';
import { ExperimentGroupPageProps, ExperimentGroupRowType } from './types';

const ExperimentsGroupPage = (props: ExperimentGroupPageProps) => {
  const router = useRouter();
  const { experiments } = useExperimentListContext();
  const {
    params: { groupId },
  } = props;

  const groupSpecificExperiments = useMemo(() => {
    return experiments.filter(
      (experiment) => experiment.groupId === Number(groupId),
    );
  }, [experiments, groupId]);

  const { columnDefs, rowData } =
    ExperimentGrid.convertToExperimentGroupGridData(groupSpecificExperiments);

  const groupData = useGroupSpecificData(groupSpecificExperiments);

  return (
    <>
      <div className={cn(['px-6'])}>
        <Breadcrumb />
      </div>
      <div className="px-6">
        <div className={'my-6 flex items-center gap-6'}>
          <DatasetName id={groupData.datasetId} name={groupData.datasetName} />
        </div>
        <div
          className="overflow-y-auto"
          style={{ height: 'calc(100vh - 150px)' }}
        >
          <DataTable<ExperimentGroupRowType>
            theme="ag-theme-dataset-list"
            agGridProps={{
              ...DEFAULT_GRID_OPTIONS,
              onRowClicked: (event) => {
                if (!event.data) {
                  return;
                }
                router.push(`/experiment/${event.data.id}`);
              },
              rowData,
              columnDefs,
              domLayout: 'autoHeight',
            }}
          />
        </div>
      </div>
    </>
  );
};

export default ExperimentsGroupPage;
