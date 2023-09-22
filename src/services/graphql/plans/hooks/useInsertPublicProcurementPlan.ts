import {useState} from 'react';
import {REQUEST_STATUSES} from '../../../constants';
import {PlanInsertParams, PublicProcurementPlanInsertResponse} from '../../../../types/graphql/insertPlanTypes';
import mutation from '../mutations/insertPublicProcurementPlan';
import useAppContext from '../../../../context/useAppContext';

const useInsertPublicProcurementPlan = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const insertPlan = async (data: PlanInsertParams, onSuccess?: (id: number) => void, onError?: () => void) => {
    setLoading(true);
    const response: PublicProcurementPlanInsertResponse = await fetch(mutation, {data});

    if (response.publicProcurementPlan_Insert.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess(response.publicProcurementPlan_Insert.item.id);
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: insertPlan};
};

export default useInsertPublicProcurementPlan;
