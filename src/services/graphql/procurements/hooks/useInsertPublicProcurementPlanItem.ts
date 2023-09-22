import {useState} from 'react';
import {
  ProcurementItemInsert,
  ProcurementPlanItemInsertResponse,
} from '../../../../types/graphql/publicProcurementPlanItemDetailsTypes';
import {REQUEST_STATUSES} from '../../../constants';
import mutation from '../mutations/insertPublicProcurementPlanItem';
import useAppContext from '../../../../context/useAppContext';

const useInsertPublicProcurementPlanItem = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const insertProcurement = async (
    data: ProcurementItemInsert,
    onSuccess?: (id: number) => void,
    onError?: () => void,
  ) => {
    setLoading(true);
    const response: ProcurementPlanItemInsertResponse = await fetch(mutation, {data});

    if (response.publicProcurementPlanItem_Insert.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess(response?.publicProcurementPlanItem_Insert.item.id);
    } else {
      onError && onError();
    }
    setLoading(false);
  };
  return {loading, mutate: insertProcurement};
};

export default useInsertPublicProcurementPlanItem;
