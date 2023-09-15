import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import {GetPlansOverviewParams, PlanItem} from '../../../../types/graphql/getPlansTypes';

const useGetPlansOverview = ({status, year, page, size, is_pre_budget}: GetPlansOverviewParams) => {
  const [getPlans, setgetPlans] = useState<PlanItem[]>();
  const [loading, setLoading] = useState(true);

  const GetPlans = async () => {
    const response = await GraphQL.getPlansOverview({status, year, page, size, is_pre_budget});
    const plans = response?.items;

    setgetPlans(plans);
    setLoading(false);
  };

  useEffect(() => {
    GetPlans();
  }, [status, year, page, size, is_pre_budget]);

  return {data: getPlans, loading, refetchData: GetPlans};
};

export default useGetPlansOverview;
