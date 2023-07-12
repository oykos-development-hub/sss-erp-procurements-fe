import {useState} from 'react';
import {GraphQL} from '../..';
import {REQUEST_STATUSES} from '../../../constants';
import {PlanInsertParams} from '../../../../types/graphql/insertPlanTypes';

const useInsertPublicProcurementPlan = () => {
  const [loading, setLoading] = useState(false);

  const insertPlan = async (data: PlanInsertParams, onSuccess?: (id: number) => void, onError?: () => void) => {
    setLoading(true);
    const response = await GraphQL.insertPublicProcurementPlan(data);

    if (response.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess(response?.items[0].id);
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: insertPlan};
};

export default useInsertPublicProcurementPlan;
