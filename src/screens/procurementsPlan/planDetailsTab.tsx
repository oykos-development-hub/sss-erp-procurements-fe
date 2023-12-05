import {Button, EditIconTwo, EyeIcon, FilePlusIcon, Theme, TrashIcon} from 'client-library';
import {Controls, Filters, Header, SubTitle, TableContainer} from '../../shared/styles';
import React, {useMemo, useState} from 'react';
import {PublicProcurementModal} from '../../components/pocurementsModal/newPublicProcurementModal';
import {ProcurementContractModal} from '../../components/procurementContractModal/procurementContractModal';
import {checkPermission, isEditProcurementAndPlanDisabled, UserPermission, UserRole} from '../../constants';
import {NotificationsModal} from '../../shared/notifications/notificationsModal';
import {ProcurementItem, isProcurementFinished} from '../../types/graphql/publicProcurementPlanItemDetailsTypes';
import {Column, Price} from './styles';
import {PlanDetailsTabProps} from './types';
import useDeletePublicProcurementPlanItem from '../../services/graphql/procurements/hooks/useDeletePublicProcurementPlanItem';
import {getTableHeadsPlanDetails} from './constants';
import {PublicProcurementSimpleModal} from '../../components/pocurementsModal/newPublicProcurementSimpleModal';
import useAppContext from '../../context/useAppContext';

export const PlanDetailsTab: React.FC<PlanDetailsTabProps> = ({
  planDetails,
  fetchPlanDetails,
  isLoadingPlanDetails,
  isSimpleProcurement,
}) => {
  const {
    navigation,
    alert,
    contextMain: {role_id},
    breadcrumbs,
  } = useAppContext();

  const [selectedItemId, setSelectedItemId] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const url = navigation.location.pathname;
  const planID = +url.split('/').pop();

  const isEditPlanDisabled = isEditProcurementAndPlanDisabled(planDetails?.status || '');

  const {items} = planDetails || {};

  const procurements = items?.filter(item => item.is_open_procurement === !isSimpleProcurement) || [];

  const totalNet =
    procurements
      ?.filter(procurement => isProcurementFinished(procurement.status))
      .reduce((total: number, item) => {
        const netPriceTotal = item.articles
          .map(article => (article.net_price || 0) * article.total_amount)
          .reduce((sum, price) => sum + price, 0);
        return total + netPriceTotal;
      }, 0) || 0;

  const totalPrice = procurements
    ?.filter(procurement => isProcurementFinished(procurement.status))
    .reduce((total: number, item) => {
      const itemTotalPrice = item.articles.reduce((sum, article) => {
        const netPrice = article.net_price || 0;
        const vatPercentage = article.vat_percentage;
        const articleTotalPrice = article.total_amount * (netPrice + (netPrice * Number(vatPercentage)) / 100);
        return sum + articleTotalPrice;
      }, 0);
      return total + itemTotalPrice;
    }, 0);

  const {mutate} = useDeletePublicProcurementPlanItem();

  const selectedItem = useMemo(() => {
    return procurements?.find((item: ProcurementItem) => item.id === selectedItemId);
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
          fetchPlanDetails();
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

  const navigateToDetailsScreen = (row: ProcurementItem) => {
    if ([UserRole.ADMIN, UserRole.OFFICIAL_FOR_PUBLIC_PROCUREMENTS].includes(role_id)) {
      navigation.navigate(`/procurements/plans/${planID}/procurement-details/${row.id.toString()}`);
      breadcrumbs.add({
        name: `Nabavka Broj. ${row.title || ''} / Konto: ${row.budget_indent?.title || ''}`,
        to: `/procurements/plans/${planID}/procurement-details/${row.id.toString()}`,
      });
    } else {
      navigation.navigate(`/procurements/plans/${planID}/procurement-details-manager/${row.id.toString()}`);
      breadcrumbs.add({
        name: `Nabavka Broj. ${row.title || ''} / Konto: ${row.budget_indent?.title || ''}`,
        to: `/procurements/plans/${planID}/procurement-details-manager/${row.id.toString()}`,
      });
    }
  };

  return (
    <>
      <Header>
        <Filters>
          <Column>
            <SubTitle variant="bodySmall" content="UKUPNA VRIJEDNOST PLANA BEZ PDV-A:" />
            <Price
              variant="bodySmall"
              content={`€ ${totalNet?.toLocaleString('sr-RS', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
            />
          </Column>
          <Column>
            <SubTitle variant="bodySmall" content="UKUPNA VRIJEDNOST PLANA SA PDV-OM:" />
            <Price
              variant="bodySmall"
              content={`€ ${totalPrice?.toLocaleString('sr-RS', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
            />
          </Column>
        </Filters>
        {checkPermission(role_id, UserPermission.CREATE_PROCUREMENT) && (
          <Controls>
            <Button content="Nova nabavka" onClick={handleAdd} disabled={isEditPlanDisabled && !isSimpleProcurement} />
          </Controls>
        )}
      </Header>
      <TableContainer
        isLoading={isLoadingPlanDetails}
        tableHeads={
          checkPermission(role_id, UserPermission.EDIT_PROCUREMENTS)
            ? getTableHeadsPlanDetails(role_id)
            : getTableHeadsPlanDetails(role_id).filter(item => item.accessor !== 'TABLE_ACTIONS')
        }
        data={procurements || []}
        onRowClick={row => navigateToDetailsScreen(row)}
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
            onClick: (item: ProcurementItem) => handleDeleteIconClick(item.id),
            icon: <TrashIcon stroke={Theme?.palette?.gray800} />,
            shouldRender: () => !isEditPlanDisabled,
          },
          {
            name: 'Ugovor',
            onClick: (item: ProcurementItem) => {
              handleContractIconClick(item.id);
            },
            icon: <FilePlusIcon stroke={Theme?.palette?.gray800} />,
            shouldRender: () => planDetails?.is_pre_budget === false && planDetails?.status === 'Objavljen',
            disabled: (row: ProcurementItem) => row.status === 'Ugovoren',
          },
          {
            name: 'Pregled ugovora',
            onClick: (row: ProcurementItem) => {
              navigation.navigate(`/procurements/contracts/${row.contract_id}/signed`);
            },
            icon: <EyeIcon stroke={Theme?.palette?.gray800} />,
            shouldRender: (row: ProcurementItem) => row.status === 'Ugovoren',
          },
        ]}
      />
      {showModal && !isSimpleProcurement && (
        <PublicProcurementModal
          alert={alert}
          fetch={fetchPlanDetails}
          open={showModal}
          onClose={closeModal}
          selectedItem={selectedItem}
          navigate={navigation.navigate}
          planID={planDetails?.id}
        />
      )}
      {showModal && isSimpleProcurement && (
        <PublicProcurementSimpleModal
          alert={alert}
          fetch={fetchPlanDetails}
          open={showModal}
          onClose={closeModal}
          navigate={navigation.navigate}
          planID={planDetails?.id}
          selectedItem={selectedItem}
        />
      )}

      {showContractModal && (
        <ProcurementContractModal
          alert={alert}
          fetch={fetchPlanDetails}
          open={showContractModal}
          onClose={closeContractModal}
          selectedItem={selectedItem}
          navigate={navigation.navigate}
        />
      )}
      <NotificationsModal
        open={!!showDeleteModal}
        onClose={handleCloseDeleteModal}
        handleLeftButtomClick={handleDelete}
        subTitle={'Ovaj fajl ce biti trajno izbrisan iz sistema'}
      />
    </>
  );
};
