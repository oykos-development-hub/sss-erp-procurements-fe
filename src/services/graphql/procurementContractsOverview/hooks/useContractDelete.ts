import {useState} from 'react';
import {REQUEST_STATUSES} from '../../../constants';
import {GraphQL} from '../../';

const useContractDelete = () => {
  const [loading, setLoading] = useState(false);

  const deleteContract = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response = await GraphQL.deleteContract(id);
    if (response.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: deleteContract};
};

export default useContractDelete;
