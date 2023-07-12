import {useState} from 'react';
import {GraphQL} from '../../index';
import {REQUEST_STATUSES} from '../../../constants';
import {ContractArticleInsert} from '../../../../types/graphql/contractsArticlesTypes';

const useInsertContractArticle = () => {
  const [loading, setLoading] = useState(false);

  const insertContractArticle = async (data: ContractArticleInsert, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response = await GraphQL.insertContractArticle(data);

    if (response.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: insertContractArticle};
};

export default useInsertContractArticle;
