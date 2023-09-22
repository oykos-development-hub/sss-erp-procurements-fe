import {useState} from 'react';
import {REQUEST_STATUSES} from '../../../constants';
import useAppContext from '../../../../context/useAppContext';
import mutation from '../mutations/procurementArticleDelete';
import {PublicProcurementArticleDeleteResponse} from '../../../../types/graphql/publicProcurementArticlesTypes';

const useProcurementArticleDelete = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const deleteProcurementArticle = async (id: number, onSuccess?: () => void, onError?: () => void) => {
    setLoading(true);
    const response: PublicProcurementArticleDeleteResponse = await fetch(mutation, {id});
    if (response.publicProcurementPlanItemArticle_Delete.status === REQUEST_STATUSES.success) {
      onSuccess && onSuccess();
    } else {
      onError && onError();
    }
    setLoading(false);
  };

  return {loading, mutate: deleteProcurementArticle};
};

export default useProcurementArticleDelete;
