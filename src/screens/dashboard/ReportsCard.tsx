import {Typography} from 'client-library';
import {Card, CardContent, CardTitle, Links, Title} from './styles';
import useAppContext from '../../context/useAppContext';
import {reportTypes} from '../reports/constants';

export const ReportsCard: React.FC = () => {
  const {
    navigation: {navigate},
    breadcrumbs,
  } = useAppContext();
  return (
    <Card>
      <Title>
        <CardTitle variant="bodyLarge" content="Generiši izvještaje" />
      </Title>
      <CardContent>
        <Links>
          <Typography
            variant="linkSmall"
            content="Planovi"
            onClick={() => {
              breadcrumbs.add({name: 'Izvještaji', path: '/procurements/reports'});
              navigate('/procurements/reports', {
                state: {reportType: reportTypes[0]},
              });
            }}
          />
          <Typography
            variant="linkSmall"
            content="Ugovori"
            onClick={() => {
              breadcrumbs.add({name: 'Izvještaji', path: '/procurements/reports'});
              navigate('/procurements/reports', {
                state: {reportType: reportTypes[1]},
              });
            }}
          />
        </Links>
      </CardContent>
    </Card>
  );
};
