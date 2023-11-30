import {Button, EditIconTwo, MicroserviceProps, TableHead, Theme, TrashIconTwo, Typography} from 'client-library';
import React, {useMemo, useState} from 'react';
import {ArticleModal} from '../../components/articleModal/articleModal';
import {LimitsModal} from '../../components/limitsModal/limitsModal';
import {UserPermission, checkPermission, isEditProcurementAndPlanDisabled} from '../../constants';
import useGetOrganizationUnits from '../../services/graphql/organizationUnits/hooks/useGetOrganizationUnits';
import usePublicProcurementPlanDetails from '../../services/graphql/plans/hooks/useGetPlanDetails';
import useProcurementArticleDelete from '../../services/graphql/procurementArticles/hooks/useProcurementArticleDelete';
import usePublicProcurementGetDetails from '../../services/graphql/procurements/hooks/useProcurementDetails';
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
import {PublicProcurement} from '../../types/graphql/publicProcurementTypes';
import {Column, FormControls, FormFooter, Plan, Price} from './styles';
import ImportArticlesModal from '../../components/importArticles/importArticlesModal';
import {VisibilityType, getVisibilityTypeName} from '../../types/graphql/publicProcurementArticlesTypes';

interface ProcurementDetailsPageProps {
  context: MicroserviceProps;
}

export const ProcurementDetails: React.FC<ProcurementDetailsPageProps> = ({context}) => {
  const [selectedItemId, setSelectedItemId] = useState(0);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [importModal, setImportModal] = useState(false);
  const procurementID = context.navigation.location.pathname.split('/').pop();
  const url = context.navigation.location.pathname;
  const planID = context.navigation.location.pathname.split('/').at(-3);
  const {organizationUnits} = useGetOrganizationUnits();

  const pathname = url.substring(0, url.lastIndexOf('/', url.lastIndexOf('/') - 1));

  const tableHeads: TableHead[] = [
    {
      title: 'Opis predmeta nabavke',
      accessor: 'title',
      type: 'text',
    },
    {
      title: 'Bitne karakteristike',
      accessor: 'description',
      type: 'text',
    },
    {
      title: 'Vrijednost neto',
      accessor: 'net_price',
      type: 'custom',
      renderContents: (net_price: any) => {
        return <Typography content={`${Number(net_price).toFixed(2)} €`} variant="bodySmall" />;
      },
    },
    {
      title: 'PDV',
      accessor: 'vat_percentage',
      type: 'custom',
      renderContents: (vat_percentage: any, row: any) => {
        const pdvValue = (Number(row?.net_price) * Number(vat_percentage)) / 100;
        return <Typography content={`${Number(pdvValue).toFixed(2)} €`} variant="bodySmall" />;
      },
    },
    {
      title: 'Ukupna količina',
      accessor: 'total_amount',
      type: 'custom',
      renderContents: (total_amount: any) => {
        return <Typography content={total_amount} variant="bodySmall" />;
      },
    },
    {
      title: 'Ukupno',
      accessor: 'total',
      type: 'custom',
      renderContents: (_, row: any) => {
        const pdvValue = (Number(row?.net_price) * Number(row?.vat_percentage)) / 100;
        const total = Number(row.net_price) + Number(pdvValue);

        const calculateTotal = total * row.total_amount;

        return <Typography content={`${calculateTotal.toFixed(2)} €`} variant="bodySmall" />;
      },
    },
    {
      title: 'Modul',
      accessor: 'visibility_type',
      type: 'custom',
      renderContents: (visibilityType: VisibilityType) => {
        return <Typography content={getVisibilityTypeName(visibilityType)} variant="bodySmall" />;
      },
    },

    {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
  ];

  const {
    publicProcurement,
    refetch: refetchData,
    loading: isLoadingProcurementDetails,
  } = usePublicProcurementGetDetails(procurementID);
  const {mutate: deleteProcurementArticle} = useProcurementArticleDelete();
  const {planDetails} = usePublicProcurementPlanDetails(planID);

  const selectedItem = useMemo(() => {
    return publicProcurement?.articles?.find((item: any) => item?.id === selectedItemId);
  }, [selectedItemId]);

  const totalNet =
    publicProcurement?.articles?.reduce(
      (sum: any, article) => sum + (article.net_price || 0) * article.total_amount,
      0,
    ) || 0;

  const totalPrice =
    publicProcurement?.articles?.reduce((sum: any, article) => {
      const pdvValue = (Number(article?.net_price) * Number(article?.vat_percentage)) / 100;
      const total = (Number(article?.net_price) + Number(pdvValue)) * article.total_amount;
      return sum + total;
    }, 0) || 0;

  const handleAddLimit = () => {
    setShowLimitModal(true);
  };

  const handleAddArticle = () => {
    setShowArticleModal(true);
  };

  const handleEdit = (id: number) => {
    setSelectedItemId(id);
    setShowArticleModal(true);
  };

  const handleDeleteIconClick = (id: number) => {
    setSelectedItemId(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setSelectedItemId(0);
    setShowDeleteModal(false);
  };

  const handleCloseArticleModal = (refetch: boolean) => {
    setSelectedItemId(0);
    setShowArticleModal(false);
    if (refetch) {
      refetchData();
    }
  };

  const handleCloseLimitModal = (refetch: boolean) => {
    setSelectedItemId(0);
    setShowLimitModal(false);
    if (refetch) {
      refetchData();
    }
  };

  const deleteArticle = () => {
    if (showDeleteModal) {
      deleteProcurementArticle(
        selectedItemId,
        () => {
          refetchData();
          context?.alert?.success('Uspješno ste obrisali artikal.');
        },
        () => {
          context?.alert?.error('Došlo je do greške pri brisanju');
        },
      );
      handleCloseDeleteModal();
    }
    setSelectedItemId(0);
  };
  const role = context?.contextMain?.role_id;

  const isEditProcurementDisabled =
    publicProcurement?.is_open_procurement === false
      ? false
      : isEditProcurementAndPlanDisabled(planDetails?.status || '');

  return (
    <ScreenWrapper>
      <SectionBox>
        <MainTitle
          variant="bodyMedium"
          content={`NABAVKA BROJ. ${publicProcurement?.title || ''} / KONTO: ${
            publicProcurement?.budget_indent?.title || ''
          }`}
          style={{marginBottom: 0}}
        />
        <CustomDivider />
        <Header>
          <Filters>
            <Column>
              <SubTitle variant="bodySmall" content="UKUPNA NETO VRIJEDNOST NABAVKE:" />
              <Price variant="bodySmall" content={`€ ${totalNet.toFixed(2)}`} />
            </Column>
            <Column>
              <SubTitle variant="bodySmall" content="UKUPNA BRUTO VRIJEDNOST NABAVKE:" />
              <Price variant="bodySmall" content={`€ ${totalPrice.toFixed(2)}`} />
            </Column>
          </Filters>

          <Controls>
            {publicProcurement?.is_open_procurement && (
              <Button content="Limit" onClick={handleAddLimit} disabled={isEditProcurementDisabled} />
            )}
            <Button content="Novi artikal" onClick={handleAddArticle} disabled={isEditProcurementDisabled} />
            <Button content="Uvezi artikle" onClick={() => setImportModal(true)} disabled={isEditProcurementDisabled} />
          </Controls>
        </Header>

        <Plan>
          <Typography
            content={publicProcurement?.plan?.title?.includes('Pred') ? 'PREDBUDŽETSKO' : 'POSTBUDŽETSKO'}
            variant="bodyMedium"
            style={{fontWeight: 600}}
          />
        </Plan>
        <TableContainer
          isLoading={isLoadingProcurementDetails}
          tableHeads={
            checkPermission(role, UserPermission.EDIT_PROCUREMENTS)
              ? tableHeads
              : tableHeads.filter(item => item?.accessor !== 'TABLE_ACTIONS')
          }
          data={publicProcurement?.articles || []}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          tableActions={[
            {
              name: 'edit',
              onClick: (item: any) => handleEdit(item.id),
              icon: <EditIconTwo stroke={Theme?.palette?.gray800} />,
              shouldRender: () => true,
              disabled: _ => isEditProcurementDisabled,
              tooltip: _ => (isEditProcurementDisabled ? `Status plana je "${planDetails?.status}"` : ''),
            },
            {
              name: 'delete',
              onClick: (item: PublicProcurement) => handleDeleteIconClick(item.id),
              icon: <TrashIconTwo stroke={Theme?.palette?.gray800} />,
              shouldRender: () => true,
              disabled: _ => isEditProcurementDisabled,
              tooltip: _ => (isEditProcurementDisabled ? `Status plana je "${planDetails?.status}"` : ''),
            },
          ]}
        />
        <NotificationsModal
          open={!!showDeleteModal}
          onClose={handleCloseDeleteModal}
          handleLeftButtomClick={deleteArticle}
          subTitle={'Ovaj fajl ce biti trajno izbrisan iz sistema'}
        />
      </SectionBox>

      <FormFooter>
        <FormControls>
          <Button
            content="Nazad"
            variant="primary"
            onClick={() => {
              context.navigation.navigate(pathname);
              context.breadcrumbs.remove();
            }}
          />
        </FormControls>
      </FormFooter>
      {showArticleModal && (
        <ArticleModal
          open={showArticleModal}
          onClose={refetch => handleCloseArticleModal(refetch)}
          selectedItem={selectedItem}
          procurementId={publicProcurement?.id}
          procurementItem={publicProcurement}
          alert={context?.alert}
        />
      )}
      <LimitsModal
        alert={context?.alert}
        open={showLimitModal}
        onClose={refetch => handleCloseLimitModal(refetch)}
        procurementId={procurementID}
        navigate={context?.navigation.navigate}
        organizationUnitList={organizationUnits}
      />
      <ImportArticlesModal
        onClose={() => setImportModal(false)}
        open={importModal}
        procurementId={procurementID}
        refetch={refetchData}
        type="article_table"
      />
    </ScreenWrapper>
  );
};
