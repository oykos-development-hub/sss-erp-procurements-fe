import {useState} from 'react';
import {GraphQL} from '../..';
import {ProcurementItemInsert} from '../../../../types/graphql/publicProcurementPlanItemDetailsTypes';
import {REQUEST_STATUSES} from '../../../constants';

const useInsertPublicProcurementPlanItem = () => {
  const [loading, setLoading] = useState(false);

  const insertProcurement = async (
    data: ProcurementItemInsert,
    onSuccess?: (id: number) => void,
    onError?: () => void,
  ) => {
    setLoading(true);
    const response = await GraphQL.insertPublicProcurementPlanItem(data);
    if (response.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess(response?.items[0].id);
    } else {
      onError && onError();
    }
    setLoading(false);
  };
  return {loading, mutate: insertProcurement};
};

export default useInsertPublicProcurementPlanItem;
