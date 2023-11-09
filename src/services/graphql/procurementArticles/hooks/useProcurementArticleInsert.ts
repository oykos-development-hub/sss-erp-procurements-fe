import {useState} from 'react';
import {
  PublicProcurementArticleInsertResponse,
  PublicProcurementArticleParams,
} from '../../../../types/graphql/publicProcurementArticlesTypes';
import {REQUEST_STATUSES} from '../../../constants';
import useAppContext from '../../../../context/useAppContext';
import mutation from '../mutations/procurementArticleInsert';

const useProcurementArticleInsert = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const insertProcurementArticle = async (
    data: PublicProcurementArticleParams,
    onSuccess?: () => void,
    onError?: () => void,
  ) => {
    setLoading(true);
    const response: PublicProcurementArticleInsertResponse = await fetch(mutation, {data: [data]});
    if (response.publicProcurementPlanItemArticle_Insert.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: insertProcurementArticle};
};

export default useProcurementArticleInsert;
