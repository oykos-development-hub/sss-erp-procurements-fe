import {useState} from 'react';
import {GraphQL} from '../../index';
import {REQUEST_STATUSES} from '../../../constants';
import {ProcurementPlanItemLimitInsert} from '../../../../types/graphql/procurementPlanItemLimits';

const useInsertProcurementPlanItemLimit = () => {
  const [loading, setLoading] = useState(false);

  const insertProcurementPlanItemLimits = async (
    data: ProcurementPlanItemLimitInsert,
    onSuccess?: () => void,
    onError?: () => void,
  ) => {
    setLoading(true);
    const response = await GraphQL.insertProcurementPlanItemLimits(data);
    if (response.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: insertProcurementPlanItemLimits};
};

export default useInsertProcurementPlanItemLimit;
