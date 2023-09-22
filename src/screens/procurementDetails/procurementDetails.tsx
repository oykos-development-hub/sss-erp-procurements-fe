import {Button, EditIconTwo, MicroserviceProps, TableHead, Theme, TrashIconTwo, Typography} from 'client-library';
import React, {useMemo, useState} from 'react';
import {ArticleModal} from '../../components/articleModal/articleModal';
import {LimitsModal} from '../../components/limitsModal/limitsModal';
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
import {Column, FormControls, FormFooter, Plan, Price} from './styles';
import {PublicProcurement} from '../../types/graphql/publicProcurementTypes';
import usePublicProcurementPlanDetails from '../../services/graphql/plans/hooks/useGetPlanDetails';
import {UserRole} from '../../constants';

interface ProcurementDetailsPageProps {
  context: MicroserviceProps;
}

export const ProcurementDetails: React.FC<ProcurementDetailsPageProps> = ({context}) => {
  const [selectedItemId, setSelectedItemId] = useState(0);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const procurementID = context.navigation.location.pathname.split('/').pop();
  const url = context.navigation.location.pathname;
  const planID = context.navigation.location.pathname.split('/').at(-3);

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
      title: 'Ukupno',
      accessor: 'total',
      type: 'custom',
      renderContents: (_, row: any) => {
        const pdvValue = (Number(row?.net_price) * Number(row?.vat_percentage)) / 100;
        const total = Number(row.net_price) + Number(pdvValue);

        const calculateTotal = total;

        return <Typography content={`${calculateTotal.toFixed(2)} €`} variant="bodySmall" />;
      },
    },
    {title: '', accessor: 'TABLE_ACTIONS', type: 'tableActions'},
  ];

  const {publicProcurement, refetch: refetchData} = usePublicProcurementGetDetails(procurementID);
  const {mutate: deleteProcurementArticle} = useProcurementArticleDelete();
  const {planDetails} = usePublicProcurementPlanDetails(planID);
  const isAdmin = context?.contextMain?.role_id === UserRole.ADMIN;

  const selectedItem = useMemo(() => {
    return publicProcurement?.articles?.find((item: any) => item?.id === selectedItemId);
  }, [selectedItemId]);

  const totalNet =
    publicProcurement?.articles?.reduce((sum: any, article: any) => sum + parseFloat(article.net_price), 0) || 0;

  const totalPrice =
    publicProcurement?.articles?.reduce((sum: any, article: any) => {
      const pdvValue = (Number(article?.net_price) * Number(article?.vat_percentage)) / 100;
      const total = Number(article?.net_price) + Number(pdvValue);
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

  return (
    <ScreenWrapper context={context}>
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
            <Button
              content="Limit"
              onClick={handleAddLimit}
              disabled={planDetails?.status === 'Zaključen' || planDetails?.status === 'Objavljen'}
            />
            <Button
              content="Novi Artikal"
              onClick={handleAddArticle}
              disabled={planDetails?.status === 'Zaključen' || planDetails?.status === 'Objavljen'}
            />
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
          tableHeads={
            (isAdmin && planDetails?.status === 'Zaključen') || (isAdmin && planDetails?.status === 'Objavljen')
              ? tableHeads.filter(item => item?.accessor !== 'TABLE_ACTIONS')
              : tableHeads
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
            },
            {
              name: 'delete',
              onClick: (item: PublicProcurement) => handleDeleteIconClick(item.id),
              icon: <TrashIconTwo stroke={Theme?.palette?.gray800} />,
              shouldRender: () => true,
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
          alert={context?.alert}
        />
      )}
      <LimitsModal
        alert={context?.alert}
        open={showLimitModal}
        onClose={refetch => handleCloseLimitModal(refetch)}
        procurementId={procurementID}
        navigate={context?.navigation.navigate}
        organizationUnits={context?.contextMain?.organization_units_list}
      />
    </ScreenWrapper>
  );
};
