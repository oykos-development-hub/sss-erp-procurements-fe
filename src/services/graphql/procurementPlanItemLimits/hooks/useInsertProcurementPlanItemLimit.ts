import {useState} from 'react';
import {REQUEST_STATUSES} from '../../../constants';
import {
  ProcurementPlanItemLimitGetResponse,
  ProcurementPlanItemLimitInsert,
} from '../../../../types/graphql/procurementPlanItemLimits';
import mutation from '../mutation/insertProcurementPlanItemLimit';
import useAppContext from '../../../../context/useAppContext';

const useInsertProcurementPlanItemLimit = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const insertProcurementPlanItemLimits = async (
    data: ProcurementPlanItemLimitInsert,
    onSuccess?: () => void,
    onError?: () => void,
  ) => {
    setLoading(true);
    const response: ProcurementPlanItemLimitGetResponse = await fetch(mutation, {data});
    if (response.publicProcurementPlanItem_Limits.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: insertProcurementPlanItemLimits};
};

export default useInsertProcurementPlanItemLimit;
