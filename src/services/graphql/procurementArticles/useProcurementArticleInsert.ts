import {useState} from 'react';
import {PublicProcurementArticleParams} from '../../../types/graphql/publicProcurementArticlesTypes';
import {GraphQL} from '..';
import {REQUEST_STATUSES} from '../../constants';

const useProcurementArticleInsert = () => {
  const [loading, setLoading] = useState(false);

  const insertProcurementArticle = async (
    data: PublicProcurementArticleParams,
    onSuccess?: () => void,
    onError?: () => void,
  ) => {
    setLoading(true);
    const response = await GraphQL.publicProcurementArticleInsert(data);
    if (response.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: insertProcurementArticle};
};

export default useProcurementArticleInsert;
