import {Tab} from '@oykos-development/devkit-react-ts-styled-components';
import {Button, EditIconTwo, Theme, TrashIcon, FilePlusIcon} from 'client-library';
import React, {useMemo, useState} from 'react';
import {PublicProcurementModal} from '../../components/pocurementsModal/newPublicProcurementModal';
import useInsertPublicProcurementPlan from '../../services/graphql/plans/hooks/useInsertPublicProcurementPlan';
import useGetOrganizationUnitPublicProcurements from '../../services/graphql/organizationUnitPublicProcurements/hooks/useGetOrganizationUnitPublicProcurements';
import useDeletePublicProcurementPlanItem from '../../services/graphql/procurements/hooks/useDeletePublicProcurementPlanItem';
import usePublicProcurementPlanDetails from '../../services/graphql/procurementsOverview/hooks/usePublicProcurementPlanDetails';
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
import {parseDate} from '../../utils/dateUtils';
import {planDetailsTabs, tableHeads} from './constants';
import {RequestsPage} from './requests';
import {Column, FormControls, FormFooter, Price, StyledTabs, TitleTabsWrapper} from './styles';
import {ProcurementsPlanPageProps} from './types';
import {ProcurementContractModal} from '../../components/procurementContractModal/procurementContractModal';
import {UserRole} from '../../constants';

export const ProcurementsPlan: React.FC<ProcurementsPlanPageProps> = ({context}) => {
  const [selectedItemId, setSelectedItemId] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const location = context?.navigation?.location;
  const [activeTab, setActiveTab] = useState(location?.state?.activeTab || 1);
  const [dateOfClosing, setDateOfClosing] = useState('');

  const alert = context?.alert;
  const url = context.navigation.location.pathname;

  const planID = url.split('/').pop();
  const pathname = url.substring(0, url.lastIndexOf('/'));

  const isAdmin = context?.contextMain?.role_id === UserRole.ADMIN;
  // const organizationUnit = context?.contextMain.organization_units_list?.find(
  //   (unit: OrganizationUnit) => unit.id === Number(url?.split('/').at(-1)),
  // );
  const organizationUnit = 2;

  const {planDetails, fetch} = usePublicProcurementPlanDetails(planID);
  const {procurements} = useGetOrganizationUnitPublicProcurements(planID, organizationUnit);

  function mergeArrays(firstArray: any, secondArray: any) {
    for (let i = 0; i < firstArray?.items?.length; i++) {
      const firstItem = firstArray.items[i];
      const secondItem = secondArray?.find((item: any) => item.id === firstItem.id); // Find the matching item in the second array
      if (secondItem) {
        // Iterate over the articles in the first item
        for (let j = 0; j < firstItem.articles.length; j++) {
          const firstArticle = firstItem.articles[j];
          const matchingArticle = secondItem.articles.find((article: any) => {
            return article.public_procurement_article.id === firstArticle.id;
          }); // Find the matching article in the second item

          if (matchingArticle) {
            firstArticle.amount = matchingArticle.amount; // Add the 'amount' field to the article in the first item
          }
        }
      } else {
        // If no matching item is found in the second array, set the 'amount' field to 0 for all articles in the first item
        for (let j = 0; j < firstItem.articles.length; j++) {
          const firstArticle = firstItem.articles[j];
          firstArticle.amount = 0;
        }
      }
    }

    return firstArray;
  }

  const procurementsPlansTableData: any = useMemo(() => {
    const mergedResult = mergeArrays(planDetails, procurements);
    return mergedResult?.items;
  }, [planDetails, procurements]);

  const {mutate: insertPlan} = useInsertPublicProcurementPlan();

  const totalNet =
    procurementsPlansTableData?.reduce((total: number, item: any) => {
      const netPrices = item.articles.map((article: any) =>
        article?.amount ? parseFloat(article.net_price) * article.amount : parseFloat(article.net_price),
      );
      const itemTotalPrice = netPrices.reduce((sum: any, price: any) => sum + price, 0);
      return total + itemTotalPrice;
    }, 0) || 0;

  const totalPrice =
    procurementsPlansTableData?.reduce((total: number, item: any) => {
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
    return procurementsPlansTableData?.find((item: ProcurementItem) => item.id === selectedItemId);
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

  const handleCompletePlan = () => {
    if (!planDetails) return;
    const payload = {
      id: planDetails?.id,
      pre_budget_id: planDetails?.pre_budget_plan?.id || 0,
      is_pre_budget: planDetails?.is_pre_budget,
      active: planDetails?.active,
      year: planDetails?.year,
      title: planDetails?.title,
      serial_number: planDetails?.serial_number,
      date_of_publishing: parseDate(planDetails?.date_of_publishing, true),
      date_of_closing: dateOfClosing,
      file_id: planDetails?.file_id,
      created_at: planDetails?.created_at,
      updated_at: planDetails?.updated_at || '',
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
    if (isAdmin) {
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
          {isAdmin && <StyledTabs tabs={planDetailsTabs} activeTab={activeTab} onChange={onTabChange} />}
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
              {isAdmin && (
                <Controls>
                  <Button
                    content="Nova nabavka"
                    onClick={handleAdd}
                    disabled={planDetails?.status === 'Zaključen' || planDetails?.status === 'Objavljen'}
                  />
                </Controls>
              )}
            </Header>
            <TableContainer
              tableHeads={!isAdmin ? tableHeads.filter(item => item.accessor !== 'TABLE_ACTIONS') : tableHeads}
              data={procurementsPlansTableData || []}
              onRowClick={row => {
                navigateToDetailsScreen(row);
              }}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              tableActions={[
                {
                  name: 'Izmeni',
                  onClick: (item: ProcurementItem) => {
                    handleEdit(item.id);
                  },
                  icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
                  shouldRender: () =>
                    isAdmin && planDetails?.status !== 'Objavljen' && planDetails?.status !== 'Zaključen',
                },
                {
                  name: 'Obriši',
                  onClick: (item: any) => handleDeleteIconClick(item.id),
                  icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
                  shouldRender: () =>
                    isAdmin && planDetails?.status !== 'Objavljen' && planDetails?.status !== 'Zaključen',
                },
                {
                  name: 'Ugovor',
                  onClick: (item: any) => handleContractIconClick(item.id),
                  icon: <FilePlusIcon stroke={Theme?.palette?.gray800} />,
                  shouldRender: () =>
                    planDetails?.is_pre_budget === false &&
                    (planDetails?.status === 'Objavljen' || planDetails?.status === 'Zaključen'),
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
            {!isAdmin && (
              <Button
                content="Pošalji"
                variant="primary"
                onClick={() => {
                  context.navigation.navigate(pathname);
                }}
                disabled={planDetails?.status === 'Konvertovan'}
              />
            )}
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
