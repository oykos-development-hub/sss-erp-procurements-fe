import {useEffect, useState} from 'react';
import {
  PublicProcurementOrganizationUnitArticlesOverviewResponse,
  RequestArticle,
} from '../../../../types/graphql/planRequests';
import useAppContext from '../../../../context/useAppContext';
import query from '../queries/getRequests';

const useGetPublicProcurementOUArticles = (procurement_id: number, organization_unit_id: number) => {
  const [articles, setArticles] = useState<RequestArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchArticles = async () => {
    try {
      const response: PublicProcurementOrganizationUnitArticlesOverviewResponse = await fetch(query, {
        procurement_id,
        organization_unit_id,
      });
      const articles = response?.publicProcurementOrganizationUnitArticles_Overview.items || [];
      setArticles(articles);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [procurement_id, organization_unit_id]);

  return {articles, loading, refetch: fetchArticles};
};

export default useGetPublicProcurementOUArticles;
