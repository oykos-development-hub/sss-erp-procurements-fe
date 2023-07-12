import {useState} from 'react';
import {GraphQL} from '..';
import {REQUEST_STATUSES} from '../../constants';

const useProcurementArticleDelete = () => {
  const [loading, setLoading] = useState(false);

  const deleteProcurementArticle = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response = await GraphQL.publicProcurementArticleDelete(id);
    if (response.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: deleteProcurementArticle};
};

export default useProcurementArticleDelete;
