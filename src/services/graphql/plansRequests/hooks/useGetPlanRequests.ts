import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import {RequestArticle} from '../../../../types/graphql/planRequests';

const useGetPublicProcurementPlanRequests = (ids: number[]) => {
  const [requests, setRequests] = useState<RequestArticle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    let items: any = [];
    for (const id of ids) {
      const response = await GraphQL.getPublicProcurementPlanRequests(id);
      const requests = response?.items;
      items = [...items, ...requests];
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
