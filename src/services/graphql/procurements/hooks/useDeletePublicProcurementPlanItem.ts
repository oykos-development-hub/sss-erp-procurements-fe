import {useState} from 'react';
import {GraphQL} from '../..';
import {REQUEST_STATUSES} from '../../../constants';

const useDeletePublicProcurementPlanItem = () => {
  const [loading, setLoading] = useState(false);

  const deletePublicProcurementPlanItem = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response = await GraphQL.deletePublicProcurementPlanItem(id);

    if (response.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: deletePublicProcurementPlanItem};
};

export default useDeletePublicProcurementPlanItem;
