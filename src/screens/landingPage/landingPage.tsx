import {Typography, PlanIcon, ContractIcon, ReportIcon} from 'client-library';
import React from 'react';
import useAppContext from '../../context/useAppContext';
import ScreenWrapper from '../../shared/screenWrapper';
import {Container, ContentBox, IconWrapper, LandingPageTitle, Title, TitleWrapper} from './styles';

export const LandingPage: React.FC = () => {
  const {
    navigation: {navigate},
    breadcrumbs,
  } = useAppContext();

  return (
    <ScreenWrapper showBreadcrumbs={false}>
      <div>
        <LandingPageTitle>
          <Typography variant="bodyLarge" style={{fontWeight: 600}} content="JAVNE NABAVKE" />
        </LandingPageTitle>
        <Container>
          <ContentBox
            onClick={() => {
              breadcrumbs.add({name: 'Planovi', path: '/procurements/plans'});
              navigate('/procurements/plans');
            }}>
            <TitleWrapper>
              <Title variant="bodyLarge" content="Planovi" />
            </TitleWrapper>
            <IconWrapper>
              <PlanIcon />
            </IconWrapper>
          </ContentBox>
          <ContentBox
            onClick={() => {
              breadcrumbs.add({name: 'Ugovori', path: '/procurements/contracts'});
              navigate('/procurements/contracts');
            }}>
            <TitleWrapper>
              <Title variant="bodyLarge" content="Ugovori" />
            </TitleWrapper>
            <IconWrapper>
              <ContractIcon />
            </IconWrapper>
          </ContentBox>
          <ContentBox
            onClick={() => {
              breadcrumbs.add({name: 'Izvještaji', path: '/procurements/reports'});
              navigate('/procurements/reports');
            }}>
            <TitleWrapper>
              <Title variant="bodyLarge" content="Izvještaji" />
            </TitleWrapper>
            <IconWrapper>
              <ReportIcon />
            </IconWrapper>
          </ContentBox>
        </Container>
      </div>
    </ScreenWrapper>
  );
};
