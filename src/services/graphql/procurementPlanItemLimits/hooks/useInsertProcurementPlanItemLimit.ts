import {useState} from 'react';
import {REQUEST_STATUSES} from '../../../constants';
import {
  ProcurementPlanItemLimit,
  ProcurementPlanItemLimitInsert,
  ProcurementPlanItemLimitInsertResponse,
} from '../../../../types/graphql/procurementPlanItemLimits';
import mutation from '../mutation/insertProcurementPlanItemLimit';
import useAppContext from '../../../../context/useAppContext';

const useInsertProcurementPlanItemLimit = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const insertProcurementPlanItemLimits = async (
    data: ProcurementPlanItemLimitInsert,
    onSuccess?: (item: ProcurementPlanItemLimit) => void,
    onError?: (message: string) => void,
  ) => {
    setLoading(true);
    const response: ProcurementPlanItemLimitInsertResponse = await fetch(mutation, {data});
    if (response.publicProcurementPlanItemLimit_Insert.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess(response.publicProcurementPlanItemLimit_Insert.item);
    } else {
      onError && onError(response.publicProcurementPlanItemLimit_Insert.message);
    }
    setLoading(false);
  };

  return {loading, mutate: insertProcurementPlanItemLimits};
};

export default useInsertProcurementPlanItemLimit;
