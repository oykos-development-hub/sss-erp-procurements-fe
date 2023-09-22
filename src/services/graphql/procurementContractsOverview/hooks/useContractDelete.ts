import {useState} from 'react';
import {REQUEST_STATUSES} from '../../../constants';
import mutation from '../mutations/deleteContract';
import useAppContext from '../../../../context/useAppContext';

const useContractDelete = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const deleteContract = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);

    const response = await fetch(mutation, {id});
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
