import {useState} from 'react';
import {GraphQL} from '../..';
import {REQUEST_STATUSES} from '../../../constants';

const useDeletePublicProcurementPlan = () => {
  const [loading, setLoading] = useState(false);

  const deletePlan = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response = await GraphQL.deletePublicProcurementPlan(id);

    if (response.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: deletePlan};
};

export default useDeletePublicProcurementPlan;
