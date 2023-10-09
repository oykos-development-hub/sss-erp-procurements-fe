import {useState} from 'react';
import {
  ProcurementOrganizationUnitArticlesInsertParams,
  ProcurementOrganizationUnitArticlesInsertResponse,
} from '../../../../types/graphql/procurementOrganizationUnitArticlesOverview';
import {REQUEST_STATUSES} from '../../../constants';
import useAppContext from '../../../../context/useAppContext';
import mutation from '../mutations/publicProcurementOrganizationUnitArticleInsert';

const useProcurementOrganizationUnitArticleInsert = () => {
  const [loading, setLoading] = useState(false);
  const {fetch} = useAppContext();

  const insertOrganizationUnitArticle = async (
    data: ProcurementOrganizationUnitArticlesInsertParams,
    onSuccess?: (id: number) => void,
    onError?: () => void,
  ) => {
    setLoading(true);
    const response: ProcurementOrganizationUnitArticlesInsertResponse = await fetch(mutation, {data});
    if (
      response.publicProcurementOrganizationUnitArticle_Insert.status === REQUEST_STATUSES.success &&
      response.publicProcurementOrganizationUnitArticle_Insert.item
    ) {
      onSuccess && onSuccess(response.publicProcurementOrganizationUnitArticle_Insert.item.id);
    } else {
      onError && onError();
    }

    setLoading(false);
  };
  return {loading, mutate: insertOrganizationUnitArticle};
};

export default useProcurementOrganizationUnitArticleInsert;
