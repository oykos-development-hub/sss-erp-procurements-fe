import {useMemo, useState} from 'react';
import {Typography} from 'client-library';
import {DashboardTitle} from '../../shared/styles';
import {Container, ContentContainer, Grid} from './styles';
import {PlanCard} from './PlanCard';
import {ContractCard} from './ContractCard';
import {NotificationsCard} from './NotificationsCard';
import {ReportsCard} from './ReportsCard';
import useGetPlansOverview from '../../services/graphql/plans/hooks/useGetPlans';
import useProcurementContracts from '../../services/graphql/procurementContractsOverview/hooks/useProcurementContracts';

export const Dashboard: React.FC = () => {
  const {data: plansData, loading} = useGetPlansOverview({page: 1, size: 100000, is_pre_budget: false});
  const {data: contractData, loading: loadingContracts} = useProcurementContracts({sort_by_date_of_expiry: 'desc'});
  const years = (!loading && plansData?.map((plan: any) => Number(plan.year)).sort((a, b) => b - a)) || [];
  const [selectedYear, setSelectedYear] = useState(years[0]);

  const currentPlan = useMemo(() => {
    const year = selectedYear?.toString() || years[0]?.toString();
    return plansData && plansData?.find((plan: any) => plan.year === year);
  }, [selectedYear, years]);

  return (
    <Container>
      <DashboardTitle>
        <Typography variant="bodyLarge" style={{fontWeight: 600}} content="JAVNE NABAVKE" />
      </DashboardTitle>
      <ContentContainer>
        <Grid>
          <PlanCard years={years} handleYearChange={year => setSelectedYear(year)} currentPlan={currentPlan} />
          <ContractCard contracts={contractData} loading={loadingContracts} />
        </Grid>
        <NotificationsCard />
      </ContentContainer>
      <ReportsCard />
    </Container>
  );
};
