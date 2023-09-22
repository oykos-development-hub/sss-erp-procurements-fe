import {useEffect, useState} from 'react';
import {GetPlansOverviewParams, PlanItem, PlanOverviewResponse} from '../../../../types/graphql/getPlansTypes';
import query from '../queries/getPlansOverview';
import useAppContext from '../../../../context/useAppContext';

const useGetPlansOverview = ({status, year, page, size, is_pre_budget}: GetPlansOverviewParams) => {
  const [getPlans, setGetPlans] = useState<PlanItem[]>();
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const GetPlans = async () => {
    const response: PlanOverviewResponse = await fetch(query, {status, year, page, size, is_pre_budget});
    setGetPlans(response?.publicProcurementPlans_Overview.items);
    setLoading(false);
  };

  useEffect(() => {
    GetPlans();
  }, [status, year, page, size, is_pre_budget]);

  return {data: getPlans, loading, refetchData: GetPlans};
};

export default useGetPlansOverview;
