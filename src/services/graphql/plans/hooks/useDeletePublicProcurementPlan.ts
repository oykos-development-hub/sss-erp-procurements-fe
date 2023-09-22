import {useState} from 'react';
import {REQUEST_STATUSES} from '../../../constants';
import useAppContext from '../../../../context/useAppContext';
import mutation from '../mutations/deletePublicProcurementPlan';
import {PublicProcurementPlanDeleteResponse} from '../../../../types/graphql/deletePlansTypes';

const useDeletePublicProcurementPlan = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const deletePlan = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);

    const response: PublicProcurementPlanDeleteResponse = await fetch(mutation, {id});

    if (response.publicProcurementPlan_Delete.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: deletePlan};
};

export default useDeletePublicProcurementPlan;
