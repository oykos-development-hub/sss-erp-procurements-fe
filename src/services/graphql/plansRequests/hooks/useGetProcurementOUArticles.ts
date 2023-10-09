import { useEffect, useState } from 'react';
import {
  PublicProcurementOrganizationUnitArticlesOverviewResponse,
  RequestArticle,
} from '../../../../types/graphql/planRequests';
import useAppContext from '../../../../context/useAppContext';
import query from '../queries/getRequests';

const useGetPublicProcurementOUArticles = (id: number) => {
  const [articles, setArticles] = useState<RequestArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const { fetch } = useAppContext();

  const fetchArticles = async () => {
    try {
      const response: PublicProcurementOrganizationUnitArticlesOverviewResponse = await fetch(query, {
        procurement_id: id,
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
  }, [id]);

  return { articles, loading, refetch: fetchArticles };
};

export default useGetPublicProcurementOUArticles;
