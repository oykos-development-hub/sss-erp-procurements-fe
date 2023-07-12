import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import {ProcurementItem} from '../../../../types/graphql/publicProcurementPlanItemDetailsTypes';

const usePublicProcurementPlanItemDetailsOverview = (id?: number) => {
  const [procurementDetails, setProcurementDetails] = useState<ProcurementItem[]>();
  const [loading, setLoading] = useState(true);

  const fetchProcurementDetails = async () => {
    const response = await GraphQL.getPublicProcurementPlanItemDetails(id);
    const procurements = response?.items;

    setProcurementDetails(procurements);
    setLoading(false);
  };

  useEffect(() => {
    fetchProcurementDetails();
  }, [id]);

  return {procurementDetails: procurementDetails, loading, fetch: fetchProcurementDetails};
};

export default usePublicProcurementPlanItemDetailsOverview;
