import {useEffect, useState} from 'react';
import {ProcurementItemForOrganizationUnit} from '../../../../types/graphql/publicProcurementPlanItemDetailsTypes';
import useAppContext from '../../../../context/useAppContext';
import query from '../queries/getOrganizationUnitPublicProcurements';
import {PublicProcurementOrganizationUnitArticlesResponse} from '../../../../types/graphql/organizationUnitPublicProcurements';

const useGetOrganizationUnitPublicProcurements = (plan_id: number, organization_unit_id?: number) => {
  const [procurements, setProcurements] = useState<ProcurementItemForOrganizationUnit[]>();
  const [loading, setLoading] = useState(true);
  const {fetch} = useAppContext();

  const getProcurements = async () => {
    const response: PublicProcurementOrganizationUnitArticlesResponse = await fetch(query, {
      plan_id,
      organization_unit_id,
    });
    const procurements = response?.publicProcurementOrganizationUnitArticles_Details.items;

    setProcurements(procurements);
    setLoading(false);
  };

  useEffect(() => {
    getProcurements();
  }, [plan_id, organization_unit_id]);

  return {procurements, loading, refetch: getProcurements};
};

export default useGetOrganizationUnitPublicProcurements;
