import {useState} from 'react';
import {GraphQL} from '../../index';
import {REQUEST_STATUSES} from '../../../constants';
import {ProcurementContractInsert} from '../../../../types/graphql/procurementContractsTypes';

const useInsertProcurementContract = () => {
  const [loading, setLoading] = useState(false);

  const insertContract = async (
    data: ProcurementContractInsert,
    onSuccess?: (id: number) => void,
    onError?: () => void,
  ) => {
    setLoading(true);
    const response = await GraphQL.insertProcurementContract(data);

    if (response.status === REQUEST_STATUSES.success) {
      const contractID = response?.items?.[0]?.id;
      onSuccess && onSuccess(Number(contractID));
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: insertContract};
};

export default useInsertProcurementContract;
