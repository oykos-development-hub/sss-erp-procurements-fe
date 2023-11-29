import {Typography} from 'client-library';
import {Card, CardTitle, Title} from './styles';

export const NotificationsCard: React.FC = () => {
  return (
    <Card>
      <Title>
        <CardTitle variant="bodyLarge" content="Notifikacije" />
        <Typography variant="bodyLarge" content="Vidi sve notifikacije" />
      </Title>
    </Card>
  );
};
