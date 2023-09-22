import {useEffect, useState} from 'react';
import {
  PublicProcurementOrganizationUnitArticlesOverviewResponse,
  RequestArticle,
} from '../../../../types/graphql/planRequests';
import useAppContext from '../../../../context/useAppContext';
import query from '../queries/getRequests';

const useGetPublicProcurementPlanRequests = (ids: number[]) => {
  const [requests, setRequests] = useState<RequestArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchRequests = async () => {
    const items: RequestArticle[] = [];
    for (const id of ids) {
      const response: PublicProcurementOrganizationUnitArticlesOverviewResponse = await fetch(query, {
        procurement_id: id,
      });
      const requests = response?.publicProcurementOrganizationUnitArticles_Overview.items;
      items.push(...requests);
    }
    setRequests(items);

    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, [ids]);

  return {requests, loading, fetch: fetchRequests};
};

export default useGetPublicProcurementPlanRequests;
