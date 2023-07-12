import {useEffect, useState} from 'react';
import {GraphQL} from '../../index';

const useGetProcurementPlanItemLimits = (id: number) => {
  const [procurementPlanLimits, setProcurementPlanLimits] = useState<any>();
  const [loading, setLoading] = useState(true);

  const getProcurementPlanItemLimit = async () => {
    const response = await GraphQL.getProcurementPlanItemLimit(id);

    setProcurementPlanLimits(response?.items);
    setLoading(false);
  };

  useEffect(() => {
    getProcurementPlanItemLimit();
  }, [id]);

  return {data: procurementPlanLimits, loading, fetch: getProcurementPlanItemLimit};
};

export default useGetProcurementPlanItemLimits;
