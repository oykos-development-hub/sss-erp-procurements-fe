import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import {Button, EditIconTwo, Theme, TrashIcon, FilePlusIcon, Input} from 'client-library';
import React, {useMemo, useState} from 'react';
import {PublicProcurementModal} from '../../components/pocurementsModal/newPublicProcurementModal';
import useInsertPublicProcurementPlan from '../../services/graphql/plans/hooks/useInsertPublicProcurementPlan';
import useDeletePublicProcurementPlanItem from '../../services/graphql/procurements/hooks/useDeletePublicProcurementPlanItem';
import usePublicProcurementPlanDetails from '../../services/graphql/plans/hooks/useGetPlanDetails';
import {NotificationsModal} from '../../shared/notifications/notificationsModal';
import ScreenWrapper from '../../shared/screenWrapper';
import {
  Controls,
  CustomDivider,
  Filters,
  Header,
  MainTitle,
  SectionBox,
  SubTitle,
  TableContainer,
} from '../../shared/styles';
import {ProcurementItem} from '../../types/graphql/publicProcurementPlanItemDetailsTypes';
import {parseDateForBackend, stringToDate} from '../../utils/dateUtils';
import {tableHeads} from './constants';
import {RequestsPage} from './requests';
import {Column, FormControls, FormFooter, Price, StyledTabs, MessageBox, TitleTabsWrapper} from './styles';
import {ProcurementsPlanPageProps} from './types';
import {ProcurementContractModal} from '../../components/procurementContractModal/procurementContractModal';
import {UserPermission, UserRole, checkPermission, isEditProcurementAndPlanDisabled} from '../../constants';
import useUpdateStatusPlan from '../../services/graphql/plans/hooks/useUpdatePlanStatus';
import {RejectedProcurementModal} from '../../components/rejectedProcurementModal/rejectedProcurementModal';

export const ProcurementsPlan: React.FC<ProcurementsPlanPageProps> = ({context}) => {
  const [selectedItemId, setSelectedItemId] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const location = context?.navigation?.location;
  const [activeTab, setActiveTab] = useState(location?.state?.activeTab || 1);
  const [isNotificationModalActive, setIsNotificationModalActive] = useState<boolean>(false);
  const [isRejectedModalActive, setIsRejectedModalActive] = useState<boolean>(false);

  const [dateOfClosing, setDateOfClosing] = useState('');

  const alert = context?.alert;
  const url = context.navigation.location.pathname;
  const {updateStatus} = useUpdateStatusPlan();

  const planID = +url.split('/').pop();

  const pathname = url.substring(0, url.lastIndexOf('/'));

  const role = context?.contextMain?.role_id; // Get the role from context

  const {planDetails, fetch, loading: isLoadingPlanDetails} = usePublicProcurementPlanDetails(planID);

  const {mutate: insertPlan} = useInsertPublicProcurementPlan();

  const buttonSendEnable = planDetails?.items?.every(item => item.status === 'Obrađen');

  const totalNet =
    planDetails?.items?.reduce((total: number, item: any) => {
      const netPrices = item.articles.map((article: any) =>
        article?.amount ? parseFloat(article.net_price) * article.amount : parseFloat(article.net_price),
      );
      const itemTotalPrice = netPrices.reduce((sum: any, price: any) => sum + price, 0);
      return total + itemTotalPrice;
    }, 0) || 0;

  const totalPrice =
    planDetails?.items?.reduce((total: number, item: any) => {
      const itemTotalPrice = item.articles.reduce((sum: any, article: any) => {
        const netPrice = parseFloat(article.net_price);
        const vatPercentage = parseFloat(article.vat_percentage);
        const articleTotalPrice = article?.amount
          ? article?.amount * (netPrice + (netPrice * vatPercentage) / 100)
          : netPrice + (netPrice * vatPercentage) / 100;
        return sum + articleTotalPrice;
      }, 0);
      return total + itemTotalPrice;
    }, 0) || 0;

  const {mutate} = useDeletePublicProcurementPlanItem();

  const selectedItem = useMemo(() => {
    return planDetails?.items?.find((item: ProcurementItem) => item.id === selectedItemId);
  }, [selectedItemId]);

  const handleAdd = () => {
    setShowModal(true);
  };

  const handleEdit = (id: number) => {
    setSelectedItemId(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItemId(0);
  };

  const closeContractModal = () => {
    setShowContractModal(false);
    setSelectedItemId(0);
  };

  const handleDeleteIconClick = (id: number) => {
    setSelectedItemId(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setSelectedItemId(0);
    setShowDeleteModal(false);
  };

  const handleContractIconClick = (id: number) => {
    setSelectedItemId(id);
    setShowContractModal(true);
  };

  const handleDelete = () => {
    if (showDeleteModal) {
      mutate(
        selectedItemId,
        () => {
          setShowDeleteModal(false);
          fetch();
          alert.success('Uspješno obrisano');
        },
        () => {
          setShowDeleteModal(false);
          alert.success('Došlo je do greške pri brisanju');
        },
      );
    }
    setSelectedItemId(0);
  };

  const onTabChange = (tab: Tab) => {
    setActiveTab(tab.id as number);
  };

  const handleUpdatePlan = () => {
    updateStatus(planDetails?.id, () => {
      context.navigation.navigate(pathname);
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
        context?.navigation.navigate('/procurements/plans');
        context?.alert.success('Plan uspješno zaključen');
      },
      () => context?.alert.error('Došlo je do greške pri zaključivanju plana'),
    );
  };

  const navigateToDetailsScreen = (row: any) => {
    if ([UserRole.ADMIN, UserRole.OFFICIAL_FOR_PUBLIC_PROCUREMENTS].includes(role)) {
      context.navigation.navigate(`/procurements/plans/${planID}/procurement-details/${row.id.toString()}`);
      context.breadcrumbs.add({
        name: `Nabavka Broj. ${row?.title || ''} / Konto: ${row?.budget_indent?.title || ''}`,
        to: `/procurements/plans/${planID}/procurement-details/${row.id.toString()}`,
      });
    } else {
      context.navigation.navigate(`/procurements/plans/${planID}/procurement-details-manager/${row.id.toString()}`);
      context.breadcrumbs.add({
        name: `Nabavka Broj. ${row?.title || ''} / Konto: ${row?.budget_indent?.title || ''}`,
        to: `/procurements/plans/${planID}/procurement-details-manager/${row.id.toString()}`,
      });
    }
  };

  const isEditPlanDisabled = isEditProcurementAndPlanDisabled(planDetails?.status || '');

  return (
    <ScreenWrapper context={context}>
      <SectionBox>
        <TitleTabsWrapper>
          <MainTitle
            variant="bodyMedium"
            content={
              activeTab === 1
                ? `PLAN ZA ${planDetails?.year} - ${planDetails?.is_pre_budget ? 'PREDBUDŽETSKO' : 'POSTBUDŽETSKO'}`
                : 'ZAHTJEVI'
            }
            style={{marginBottom: 0}}
          />
          {checkPermission(role, UserPermission.VIEW_PLANS_REQUESTS) && (
            <StyledTabs
              tabs={[
                {id: 1, title: 'Pregled', routeName: 'overview', disabled: false},
                {id: 2, title: 'Zahtjevi', routeName: 'requests', disabled: planDetails?.status != 'Poslat'},
              ]}
              activeTab={activeTab}
              onChange={onTabChange}
            />
          )}
        </TitleTabsWrapper>
        <CustomDivider style={{marginTop: 0}} />
        {activeTab === 1 ? (
          <>
            <Header>
              <Filters>
                <Column>
                  <SubTitle variant="bodySmall" content="UKUPNA NETO VRIJEDNOST PLANA:" />
                  <Price variant="bodySmall" content={`€ ${totalNet?.toFixed(2)}`} />
                </Column>
                <Column>
                  <SubTitle variant="bodySmall" content="UKUPNA BRUTO VRIJEDNOST PLANA:" />
                  <Price variant="bodySmall" content={`€ ${totalPrice?.toFixed(2)}`} />
                </Column>
              </Filters>
              {checkPermission(role, UserPermission.CREATE_PROCUREMENT) && (
                <Controls>
                  <Button content="Nova nabavka" onClick={handleAdd} disabled={isEditPlanDisabled} />
                </Controls>
              )}
            </Header>
            <TableContainer
              isLoading={isLoadingPlanDetails}
              tableHeads={
                checkPermission(role, UserPermission.EDIT_PROCUREMENTS)
                  ? tableHeads
                  : tableHeads.filter(item => item.accessor !== 'TABLE_ACTIONS')
              }
              data={planDetails?.items || []}
              onRowClick={(row: any) => {
                navigateToDetailsScreen(row);
              }}
              tableActions={[
                {
                  name: 'Izmijeni',
                  onClick: (item: ProcurementItem) => {
                    handleEdit(item.id);
                  },
                  icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
                  shouldRender: () => !isEditPlanDisabled,
                },
                {
                  name: 'Obriši',
                  onClick: (item: any) => handleDeleteIconClick(item.id),
                  icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
                  shouldRender: () => !isEditPlanDisabled,
                },
                {
                  name: 'Ugovor',
                  onClick: (item: any) => handleContractIconClick(item.id),
                  icon: <FilePlusIcon stroke={Theme?.palette?.gray800} />,
                  shouldRender: () => planDetails?.is_pre_budget === false && planDetails?.status === 'Objavljen',
                  disabled: row => row.status === 'Ugovoren',
                },
              ]}
            />
            {showModal && (
              <PublicProcurementModal
                alert={context.alert}
                fetch={fetch}
                open={showModal}
                onClose={closeModal}
                selectedItem={selectedItem}
                navigate={context.navigation.navigate}
                planID={planID}
              />
            )}

            {showContractModal && (
              <ProcurementContractModal
                alert={context.alert}
                fetch={fetch}
                open={showContractModal}
                onClose={closeContractModal}
                selectedItem={selectedItem}
                navigate={context.navigation.navigate}
              />
            )}
            <NotificationsModal
              open={!!showDeleteModal}
              onClose={handleCloseDeleteModal}
              handleLeftButtomClick={handleDelete}
              subTitle={'Ovaj fajl ce biti trajno izbrisan iz sistema'}
            />
          </>
        ) : (
          <RequestsPage
            plan={planDetails}
            context={context}
            handleDateOfClosing={(date: string) => setDateOfClosing(date)}
          />
        )}
      </SectionBox>
      {planDetails?.status === 'Obradi' &&
        planDetails.rejected_description !== null &&
        checkPermission(role, UserPermission.VIEW_REJECTED_PROCUREMENT_COMMENT) && (
          <MessageBox>{`Razlog odbijanja: ${planDetails.rejected_description}`}</MessageBox>
        )}

      <FormFooter>
        <FormControls>
          <>
            <Button
              content="Nazad"
              variant="secondary"
              onClick={() => {
                context.navigation.navigate(pathname);
                context.breadcrumbs.remove();
              }}
            />
            {checkPermission(role, UserPermission.SEND_PROCUREMENTS) && planDetails?.rejected_description === null && (
              <Button
                content="Pošalji"
                variant="primary"
                onClick={() => setIsNotificationModalActive(true)}
                disabled={!buttonSendEnable}
              />
            )}

            {checkPermission(role, UserPermission.SEND_PROCUREMENTS) &&
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
              onClick={handleCompletePlan}
              disabled={!dateOfClosing}
            />
          )}
        </FormControls>
      </FormFooter>
    </ScreenWrapper>
  );
};
