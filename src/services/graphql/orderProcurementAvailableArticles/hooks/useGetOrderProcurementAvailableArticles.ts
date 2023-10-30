import {useEffect, useState} from 'react';
import useAppContext from '../../../../context/useAppContext';
import {OrderListArticleType, OrderProcurementAvailableArticlesType} from '../../../../types/graphql/orderListTypes';
import getOrderProcurementAvailableArticles from '../queries/getOrderProcurementAvailableArticles';

const useGetOrderProcurementAvailableArticles = (public_procurement_id: number) => {
  const [articles, setArticles] = useState<OrderListArticleType[]>([]);
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();
  const fetchOrderProcurementArticles = async () => {
    const response: OrderProcurementAvailableArticlesType = await fetch(getOrderProcurementAvailableArticles, {
      public_procurement_id,
    });

    const items = response?.orderProcurementAvailableList_Overview?.items;
    setArticles(items || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrderProcurementArticles();
  }, [public_procurement_id]);

  return {articles, loading, fetch: fetchOrderProcurementArticles};
};

export default useGetOrderProcurementAvailableArticles;
