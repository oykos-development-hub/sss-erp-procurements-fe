import {useEffect, useState} from 'react';
import {
  ProcurementPlanDetails,
  ProcurementPlanDetailsGetResponse,
} from '../../../../types/graphql/publicProcurementPlanItemDetailsTypes';
import useAppContext from '../../../../context/useAppContext';
import query from '../queries/getPlanDetails';

const usePublicProcurementPlanDetails = (id: number) => {
  const [planDetails, setPlanDetails] = useState<ProcurementPlanDetails>();
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const fetchPlanDetails = async () => {
    const response: ProcurementPlanDetailsGetResponse = await fetch(query, {id});
    setPlanDetails(response?.publicProcurementPlan_Details.item);
    setLoading(false);
  };

  useEffect(() => {
    fetchPlanDetails();
  }, [id]);

  return {planDetails: planDetails, loading, fetch: fetchPlanDetails};
};

export default usePublicProcurementPlanDetails;
