import {useEffect, useState} from 'react';
import query from '../queries/getProcurementPlanItemLimits';
import useAppContext from '../../../../context/useAppContext';
import {
  ProcurementPlanItemLimit,
  ProcurementPlanItemLimitGetResponse,
} from '../../../../types/graphql/procurementPlanItemLimits';

const useGetProcurementPlanItemLimits = (id: number) => {
  const [procurementPlanLimits, setProcurementPlanLimits] = useState<ProcurementPlanItemLimit[]>();
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const getProcurementPlanItemLimit = async () => {
    const response: ProcurementPlanItemLimitGetResponse = await fetch(query, {id});

    setProcurementPlanLimits(response?.publicProcurementPlanItem_Limits.items);
    setLoading(false);
  };

  useEffect(() => {
    getProcurementPlanItemLimit();
  }, [id]);

  return {data: procurementPlanLimits, loading, fetch: getProcurementPlanItemLimit};
};

export default useGetProcurementPlanItemLimits;
