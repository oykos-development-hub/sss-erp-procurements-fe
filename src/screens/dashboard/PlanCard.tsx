import {useRef, useState} from 'react';
import {Typography} from 'client-library';
import {Card, CardContent, CardTitle, FooterButton, Icon, PlanInfo, Title, YearsFilter} from './styles';
import {Popup} from '../../components/popup/Popup';
import {numberToPriceString} from '../../utils/stringUtils';
import useAppContext from '../../context/useAppContext';
import {PlanItem} from '../../types/graphql/getPlansTypes';

interface PlanCardProps {
  years: number[];
  handleYearChange: (year: number) => void;
  currentPlan?: PlanItem;
}

export const PlanCard: React.FC<PlanCardProps> = ({years, handleYearChange, currentPlan}) => {
  const [openPopup, setOpenPopup] = useState(false);
  const {
    contextMain: {organization_units},
    navigation: {navigate},
    breadcrumbs,
  } = useAppContext();
  const iconRef = useRef(null);
  const selectYear = (item: any) => {
    handleYearChange(item);
    setOpenPopup(false);
  };
  return (
    <Card>
      <Title>
        <CardTitle variant="bodyLarge" content="Plan" />
        <YearsFilter>
          <Typography variant="bodyLarge" style={{fontWeight: 600}} content={currentPlan?.year || years[0]} />
          <span ref={iconRef}>
            <Icon isOpen={openPopup} onClick={() => setOpenPopup(!openPopup)} />
          </span>
          <Popup
            isOpen={openPopup}
            items={years}
            togglePopup={() => setOpenPopup(false)}
            targetRef={iconRef}
            handleItemClick={item => selectYear(item)}
          />
        </YearsFilter>
      </Title>
      <CardContent>
        <PlanInfo>
          <div>
            <Typography variant="h5" content={currentPlan?.status || ''} />
            <Typography variant="bodySmall" content="Status" />
          </div>
          <div>
            <Typography
              variant="h5"
              content={`${currentPlan?.total_gross && numberToPriceString(currentPlan?.total_gross)} €` || ''}
            />
            <Typography variant="bodySmall" content="Procijenjena vrijednost" />
          </div>
          <div>
            <Typography
              variant="h5"
              content={`${currentPlan?.approved_requests} / ${organization_units?.length}` || ''}
            />
            <Typography variant="bodySmall" content="Odobrenih zahtjeva" />
          </div>
        </PlanInfo>
      </CardContent>

      <FooterButton
        variant="primary"
        onClick={() => {
          breadcrumbs.add({name: 'Planovi', path: '/procurements/plans'});
          navigate('/procurements/plans');
        }}>
        <Typography variant="bodySmall" content="Pogledaj sve planove" />
      </FooterButton>
    </Card>
  );
};
