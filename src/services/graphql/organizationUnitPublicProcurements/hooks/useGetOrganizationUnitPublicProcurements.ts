import {useEffect, useState} from 'react';
import {GraphQL} from '../..';
import {ProcurementItemForOrganizationUnit} from '../../../../types/graphql/publicProcurementPlanItemDetailsTypes';

const useGetOrganizationUnitPublicProcurements = (plan_id: number, organization_unit_id: number) => {
  const [procurements, setProcurements] = useState<ProcurementItemForOrganizationUnit[]>();
  const [loading, setLoading] = useState(true);

  const getProcurements = async () => {
    const response = await GraphQL.getOrganizationUnitPublicProcurements({plan_id, organization_unit_id});
    const procurements = response?.items;

    setProcurements(procurements);
    setLoading(false);
  };

  useEffect(() => {
    getProcurements();
  }, [plan_id, organization_unit_id]);

  return {procurements, loading, refetch: getProcurements};
};

export default useGetOrganizationUnitPublicProcurements;
