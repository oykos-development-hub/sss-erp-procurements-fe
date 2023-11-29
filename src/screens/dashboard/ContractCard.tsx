import {Theme, ArrowRightCircleIcon, Typography} from 'client-library';
import {Card, CardContent, CardTitle, ContractsTable, FooterButton, Title} from './styles';
import {ProcurementContract} from '../../types/graphql/procurementContractsTypes';
import {dashboardContractsTableHeads} from './constants';
import useAppContext from '../../context/useAppContext';

interface ContractCardProps {
  contracts?: ProcurementContract[];
  loading: boolean;
}

export const ContractCard: React.FC<ContractCardProps> = ({contracts, loading}) => {
  const {
    navigation: {navigate},
    breadcrumbs,
  } = useAppContext();
  return (
    <Card>
      <Title>
        <CardTitle variant="bodyLarge" content="Uskoro ističu ugovori" />
      </Title>
      <CardContent>
        <ContractsTable
          data={contracts || []}
          isLoading={loading}
          tableHeads={dashboardContractsTableHeads}
          tableActions={[
            {
              name: 'edit',
              onClick: (item: any) => {
                breadcrumbs.add({
                  name: `Detalji zaključenog ugovora ${item?.serial_number} `,
                  to: `/procurements/contracts/${item.id.toString()}/signed`,
                });
                navigate(`/procurements/contracts/${item.id}/signed`);
              },
              icon: <ArrowRightCircleIcon stroke={Theme?.palette?.gray600} />,
            },
          ]}
        />
      </CardContent>
      <FooterButton
        variant="secondary"
        onClick={() => {
          breadcrumbs.add({name: 'Planovi', path: '/procurements/contracts'});
          navigate('/procurements/contracts');
        }}>
        <Typography variant="bodySmall" content="Pogledaj sve ugovore" />
      </FooterButton>
    </Card>
  );
};
