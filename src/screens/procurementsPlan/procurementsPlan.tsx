import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import {Button} from 'client-library';
import React, {useEffect, useState} from 'react';
import {RejectedProcurementModal} from '../../components/rejectedProcurementModal/rejectedProcurementModal';
import {UserPermission, checkPermission} from '../../constants';
import usePublicProcurementPlanDetails from '../../services/graphql/plans/hooks/useGetPlanDetails';
import useInsertPublicProcurementPlan from '../../services/graphql/plans/hooks/useInsertPublicProcurementPlan';
import useSendProcurementOnRevision from '../../services/graphql/plans/hooks/useSendProcurementOnRevision';
import {NotificationsModal} from '../../shared/notifications/notificationsModal';
import ScreenWrapper from '../../shared/screenWrapper';
import {CustomDivider, MainTitle, SectionBox} from '../../shared/styles';
import {parseDateForBackend, stringToDate} from '../../utils/dateUtils';
import {RequestsPage} from './requests';
import {FormControls, FormFooter, MessageBox, StyledTabs, TitleTabsWrapper} from './styles';
import {ProcurementsPlanPageProps} from './types';
import {PlanCloseModal} from '../../components/planCloseModal/planCloseModal';
import {PlanDetailsTab} from './planDetailsTab';
import {ProcurementStatus} from '../../types/graphql/publicProcurementPlanItemDetailsTypes';
import useAppContext from '../../context/useAppContext';
import useGetPlanPDFUrl from '../../services/graphql/planPDF/useGetPlanPDFUrl';
import PlanPDFDocument from './planPDF';
import {usePDF} from '@react-pdf/renderer';
import {downloadPDF} from '../../services/constants';

export const ProcurementsPlan: React.FC<ProcurementsPlanPageProps> = () => {
  const {
    contextMain: {role_id},
    navigation,
    alert,
    breadcrumbs,
  } = useAppContext();
  const url = navigation.location.pathname;
  const location = navigation?.location;

  const planID = +url.split('/').pop();
  const pathname = url.substring(0, url.lastIndexOf('/'));

  const {sendProcurementOnRevision} = useSendProcurementOnRevision();
  const {planDetails, fetch: fetchPlanDetails, loading: isLoadingPlanDetails} = usePublicProcurementPlanDetails(planID);
  const {mutate: insertPlan} = useInsertPublicProcurementPlan();

  enum TabsEnum {
    Overview = 1,
    Requests = 2,
    SimpleProcurement = 3,
  }

  const [activeTab, setActiveTab] = useState<TabsEnum>(location?.state?.activeTab || TabsEnum.Overview);
  const [isNotificationModalActive, setIsNotificationModalActive] = useState<boolean>(false);
  const [isRejectedModalActive, setIsRejectedModalActive] = useState<boolean>(false);
  const [showPlanCloseModal, setShowPlanCloseModal] = useState<boolean>(false);
  const [dateOfClosing, setDateOfClosing] = useState('');

  const planTabs = [
    {id: TabsEnum.Overview, title: 'Pregled', routeName: 'overview', disabled: false},
    {id: TabsEnum.Requests, title: 'Zahtjevi', routeName: 'requests', disabled: planDetails?.status != 'Poslat'},
    {
      id: TabsEnum.SimpleProcurement,
      title: 'Jednostavne nabavke',
    },
  ];

  const buttonSendEnable = planDetails?.items.every(
    item => item.status === ProcurementStatus.ProcurementStatusProcessed,
  );

  const onTabChange = (tab: Tab) => {
    setActiveTab(tab.id as number);
  };

  const handleUpdatePlan = () => {
    sendProcurementOnRevision(planDetails?.id, () => {
      navigation.navigate(pathname);
      setIsNotificationModalActive(false);
      setIsRejectedModalActive(false);
    });
  };

  const handleCompletePlan = () => {
    if (!planDetails) return;
    const payload = {
      id: planDetails?.id,
      pre_budget_id: planDetails?.pre_budget_plan?.id || undefined,
      is_pre_budget: planDetails?.is_pre_budget,
      year: planDetails?.year,
      title: planDetails?.title,
      serial_number: planDetails?.serial_number,
      date_of_publishing: parseDateForBackend(new Date(planDetails?.date_of_publishing)),
      date_of_closing: parseDateForBackend(stringToDate(dateOfClosing)),
      file_id: planDetails?.file_id,
    };

    insertPlan(
      payload,
      () => {
        navigation.navigate('/procurements/plans');
        alert.success('Plan uspješno zaključen');
      },
      () => alert.error('Došlo je do greške pri zaključivanju plana'),
    );
  };

  const getTitle = () => {
    switch (activeTab) {
    case TabsEnum.Overview:
      return `PLAN ZA ${planDetails?.year} - ${planDetails?.is_pre_budget ? 'PREDBUDŽETSKO' : 'POSTBUDŽETSKO'}`;
    case TabsEnum.Requests:
      return 'ZAHTJEVI';
    case TabsEnum.SimpleProcurement:
      return `JEDNOSTAVNE NABAVKE ZA PLAN ${planDetails?.year}`;
    default:
      throw new Error(`Tab ${activeTab} does not exist`);
    }
  };

  const [contractPDF, updateInstance] = usePDF({});

  const {pdfData, loading: loadingReport} = useGetPlanPDFUrl({
    plan_id: planID,
  });

  useEffect(() => {
    if (pdfData) {
      updateInstance(<PlanPDFDocument data={pdfData} />);
    }
  }, [pdfData]);

  return (
    <ScreenWrapper>
      <SectionBox>
        <TitleTabsWrapper>
          <MainTitle variant="bodyMedium" content={getTitle()} style={{marginBottom: 0}} />
          {checkPermission(role_id, UserPermission.VIEW_PLANS_REQUESTS) && (
            <StyledTabs tabs={planTabs} activeTab={activeTab} onChange={onTabChange} />
          )}
        </TitleTabsWrapper>
        <CustomDivider style={{marginTop: 0}} />
        {(activeTab === TabsEnum.Overview || activeTab === TabsEnum.SimpleProcurement) && (
          <PlanDetailsTab
            planDetails={planDetails}
            fetchPlanDetails={fetchPlanDetails}
            isLoadingPlanDetails={isLoadingPlanDetails}
            isSimpleProcurement={activeTab === TabsEnum.SimpleProcurement}
          />
        )}
        {activeTab === TabsEnum.Requests && (
          <RequestsPage plan={planDetails} handleDateOfClosing={(date: string) => setDateOfClosing(date)} />
        )}
      </SectionBox>
      {planDetails?.status === 'Obradi' &&
        planDetails.rejected_description !== null &&
        checkPermission(role_id, UserPermission.VIEW_REJECTED_PROCUREMENT_COMMENT) && (
        <MessageBox>{`Razlog odbijanja: ${planDetails.rejected_description}`}</MessageBox>
      )}

      <FormFooter>
        <FormControls>
          <>
            {planDetails?.status === 'Objavljen' && (
              <Button
                content="Generiši izvještaj"
                variant="secondary"
                onClick={() => downloadPDF(contractPDF.blob)}
                isLoading={loadingReport}
              />
            )}
            <Button
              content="Nazad"
              variant="secondary"
              onClick={() => {
                navigation.navigate(pathname);
                breadcrumbs.remove();
              }}
            />
            {checkPermission(role_id, UserPermission.SEND_PROCUREMENTS) &&
              planDetails?.rejected_description === null && (
              <Button
                content="Pošalji"
                variant="primary"
                onClick={() => setIsNotificationModalActive(true)}
                disabled={!buttonSendEnable || planDetails?.status === 'Na čekanju'}
              />
            )}

            {checkPermission(role_id, UserPermission.SEND_PROCUREMENTS) &&
              planDetails?.status === 'Obradi' &&
              planDetails.rejected_description !== null && (
              <Button
                content="Pošalji"
                variant="primary"
                onClick={() => setIsRejectedModalActive(true)}
                disabled={!buttonSendEnable}
              />
            )}

            <NotificationsModal
              open={!!isNotificationModalActive}
              onClose={() => setIsNotificationModalActive(false)}
              handleLeftButtomClick={handleUpdatePlan}
              subTitle="Naknadne izmjene neće biti moguće."
            />

            <RejectedProcurementModal
              open={!!isRejectedModalActive}
              onClose={() => setIsRejectedModalActive(false)}
              handleRightButtonClick={handleUpdatePlan}
            />
          </>
          {activeTab === 2 && (
            <Button
              content={planDetails?.is_pre_budget ? 'Zaključi' : 'Objavi'}
              variant="primary"
              onClick={() => (planDetails?.is_pre_budget ? setShowPlanCloseModal(true) : handleCompletePlan())}
              disabled={!dateOfClosing}
            />
          )}
        </FormControls>
      </FormFooter>

      {showPlanCloseModal && (
        <PlanCloseModal
          open={!!showPlanCloseModal}
          onClose={() => setShowPlanCloseModal(false)}
          handleRightButtonClick={handleCompletePlan}
        />
      )}
    </ScreenWrapper>
  );
};
