import {useState} from 'react';
import {GraphQL} from '../..';
import {ProcurementOrganizationUnitArticlesInsertParams} from '../../../../types/graphql/procurementOrganizationUnitArticlesOverview';
import {REQUEST_STATUSES} from '../../../constants';

const useProcurementOrganizationUnitArticleInsert = () => {
  const [loading, setLoading] = useState(false);

  const insertOrganizationUnitArticle = async (
    data: ProcurementOrganizationUnitArticlesInsertParams,
    onSuccess?: (id: number) => void,
    onError?: () => void,
  ) => {
    setLoading(true);
    const response = await GraphQL.procurementOrganizationUnitArticleInsert(data);
    if (response.status === REQUEST_STATUSES.success && response.items) {
      onSuccess && onSuccess(response.items[0].id);
    } else {
      onError && onError();
    }

    setLoading(false);
  };
  return {loading, mutate: insertOrganizationUnitArticle};
};

export default useProcurementOrganizationUnitArticleInsert;
