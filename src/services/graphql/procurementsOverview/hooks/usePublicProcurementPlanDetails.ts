import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import {ProcurementPlanDetails} from '../../../../types/graphql/publicProcurementPlanItemDetailsTypes';

const usePublicProcurementPlanDetails = (id: number) => {
  const [planDetails, setPlanDetails] = useState<ProcurementPlanDetails>();
  const [loading, setLoading] = useState(true);

  const fetchPlanDetails = async () => {
    const response = await GraphQL.getPublicProcurementPlanDetails(id);
    const details = response?.items?.[0];
    setPlanDetails(details);
    setLoading(false);
  };

  useEffect(() => {
    fetchPlanDetails();
  }, [id]);

  return {planDetails: planDetails, loading, fetch: fetchPlanDetails};
};

export default usePublicProcurementPlanDetails;
