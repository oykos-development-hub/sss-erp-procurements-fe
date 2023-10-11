import {Button, MicroserviceProps, TableHead, Typography} from 'client-library';
import React, {useEffect, useMemo, useState} from 'react';
import useProcurementOrganizationUnitArticleInsert from '../../services/graphql/organizationUnitPublicProcurements/hooks/usePublicProcurementOrganizationUnitArticleInsert';
import useGetProcurementPlanItemLimits from '../../services/graphql/procurementPlanItemLimits/hooks/useGetProcurementPlanItemLimit';
import ScreenWrapper from '../../shared/screenWrapper';
import {CustomDivider, Filters, Header, MainTitle, SectionBox, SubTitle, TableContainer} from '../../shared/styles';
import {AmountInput, Column, FormControls, FormFooter, Plan, Price} from './styles';
import useGetOrganizationUnitPublicProcurements from '../../services/graphql/organizationUnitPublicProcurements/hooks/useGetOrganizationUnitPublicProcurements';
import usePublicProcurementPlanDetails from '../../services/graphql/plans/hooks/useGetPlanDetails';
import usePublicProcurementGetDetails from '../../services/graphql/procurements/hooks/useProcurementDetails';
import useGetPublicProcurementOUArticles from '../../services/graphql/plansRequests/hooks/useGetProcurementOUArticles';

interface ProcurementDetailsPageProps {
  context: MicroserviceProps;
}

export const ProcurementDetailsManager: React.FC<ProcurementDetailsPageProps> = ({context}) => {
  const url = context.navigation.location.pathname;
  const planID = url.split('/').at(-3);
  const organizationUnitId = context?.contextMain?.organization_unit?.id;

  const procurementID = url.split('/').at(-1);
  let limit = 0;
  const pathname = url.substring(0, url.lastIndexOf('/', url.lastIndexOf('/') - 1));
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const {data: procurementPlanLimits} = useGetProcurementPlanItemLimits(procurementID);
  const {planDetails} = usePublicProcurementPlanDetails(planID);
  const [requestSuccessCount, setRequestSuccessCount] = useState<number>(0);
  const [requestErrorCount, setRequestErrorCount] = useState<number>(0);

  const [isDisabled, setIsDisabled] = useState(true);
  const {mutate: insertOrganizationUnitArticle, loading: isLoadingInsertOUArticleMutate} =
    useProcurementOrganizationUnitArticleInsert();
  const [filteredArticles, setFilteredArticles] = useState<any[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, row: any) => {
    const {value} = event.target;
    const updatedArticles = [...filteredArticles];
    const index = updatedArticles.findIndex(item => item.id === row.id);

    if (index !== -1) {
      const updatedItem = {...updatedArticles[index], amount: Number(value)};
      updatedArticles[index] = updatedItem;
      setFilteredArticles(updatedArticles);
    }
  };
  const {procurements, loading: isLoadingOUProcurements} = useGetOrganizationUnitPublicProcurements(
    planID,
    organizationUnitId,
  );

  const {articles: filledArticles} = useGetPublicProcurementOUArticles(+procurementID);

  const {publicProcurement, loading: isLoadingOUProcurementDetails} = usePublicProcurementGetDetails(procurementID);

  const procurement = useMemo(() => {
    if (publicProcurement) {
      return {
        ...publicProcurement,
        articles: publicProcurement?.articles.map(article => {
          return {
            ...article,
            amount: filledArticles?.find(item => item?.public_procurement_article.id === article?.id)?.amount || 0,
          };
        }),
      };
    }
  }, [publicProcurement, procurements]);

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
      renderContents: (net_price: any, row: any) => {
        const netPrice = Number(net_price) * (row?.amount || 1);
        return <Typography content={`${netPrice.toFixed(2)} €`} variant="bodySmall" />;
      },
    },
    {
      title: 'PDV',
      accessor: '',
      type: 'custom',
      renderContents: (_: any, row: any) => {
        const pdvValue = ((Number(row?.net_price) * Number(row?.vat_percentage)) / 100) * (row?.amount || 1);
        return <Typography content={`${Number(pdvValue).toFixed(2)} €`} variant="bodySmall" />;
      },
    },
    {
      title: 'Ukupno',
      accessor: 'total',
      type: 'custom',
      renderContents: (_, row: any) => {
        const pdvValue = (Number(row?.net_price) * Number(row?.vat_percentage)) / 100;
        const total = Number(row?.net_price) + Number(pdvValue);

        const calculateTotal = total * (row?.amount || 1);

        return <Typography content={`${calculateTotal.toFixed(2)} €`} variant="bodySmall" />;
      },
    },
    {
      title: 'Količina',
      accessor: 'amount',
      type: 'custom',
      renderContents: (_, row) => {
        return (
          <AmountInput
            type="number"
            value={row.amount}
            onChange={event => handleInputChange(event, row)}
            disabled={row.amount !== '' && isDisabled}
          />
        );
      },
    },
  ];

  const totalNet =
    filteredArticles.reduce((sum: number, article: any) => sum + parseFloat(article?.net_price) * article?.amount, 0) ||
    0;

  const totalPrice =
    filteredArticles.reduce((sum: number, article: any) => {
      const pdvValue = (Number(article?.net_price) * Number(article?.vat_percentage)) / 100;
      const total = (Number(article?.net_price) + Number(pdvValue)) * article.amount;
      return sum + total;
    }, 0) || 0;

  const desiredItem = procurementPlanLimits?.find(item => {
    return item?.organization_unit?.id === organizationUnitId;
  });

  limit = parseFloat(desiredItem?.limit || '0');

  const handleSave = async () => {
    if (limit !== 0 && totalPrice > limit) {
      context.alert.error('Prekoračili ste limit.');
      return;
    }

    for (const item of filteredArticles) {
      const insertItem = {
        id: filledArticles?.find(article => article?.public_procurement_article.id === item?.id)?.id || undefined,
        public_procurement_article_id: item.id,
        organization_unit_id: organizationUnitId,
        status: item.status,
        is_rejected: item.is_rejected || false,
        rejected_description: item.rejected_description,
        amount: item.amount,
      };

      await insertOrganizationUnitArticle(
        insertItem,
        () => {
          setRequestSuccessCount(prevCount => prevCount + 1);
        },
        () => {
          context.alert.error('Nije uspješno sačuvano');
          setRequestErrorCount(prevCount => prevCount + 1);
        },
      );
    }
  };

  useEffect(() => {
    if (requestSuccessCount === filteredArticles?.length && requestSuccessCount > 0 && requestErrorCount === 0) {
      context.alert.success('Uspješno sačuvano');
      setRequestSuccessCount(0);
    }
  }, [requestSuccessCount, requestErrorCount, filteredArticles]);

  useEffect(() => {
    if (procurement) {
      setFilteredArticles(procurement?.articles);
    }
  }, [procurement]);

  return (
    <ScreenWrapper context={context}>
      <SectionBox>
        <MainTitle
          variant="bodyMedium"
          content={`NABAVKA BROJ. ${procurement?.title || ''} / KONTO: ${procurement?.budget_indent?.title || ''}`}
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
        </Header>

        <SubTitle variant="bodySmall" content="OPREDIJELJENI BUDŽET ZA NABAVKU KANC. MATERIJALA:" />
        <Price variant="bodySmall" content={`€ ${limit ? limit.toFixed(2) : ''}`} />
        <Plan>
          <Typography
            content={procurement?.plan?.id === 1 ? 'PREDBUDŽETSKO' : 'POSTBUDŽETSKO'}
            variant="bodyMedium"
            style={{fontWeight: 600}}
          />
        </Plan>
        <TableContainer
          tableHeads={tableHeads}
          data={filteredArticles || []}
          isLoading={isLoadingOUProcurements || isLoadingOUProcurementDetails}
        />
      </SectionBox>

      <FormFooter>
        <FormControls>
          <>
            {!isEdit && planDetails?.status !== 'Konvertovan' && (
              <>
                <Button
                  content="Izmijeni"
                  variant="secondary"
                  onClick={() => {
                    setIsEdit(true);
                    setIsDisabled(false);
                  }}
                />
                <Button
                  content="Završi"
                  variant="primary"
                  onClick={() => {
                    handleSave();
                    totalPrice > limit || requestErrorCount > 0 ? '' : context.navigation.navigate(pathname);
                    setRequestErrorCount(0);
                    context.breadcrumbs.remove();
                  }}
                />
              </>
            )}
            {planDetails?.status === 'Konvertovan' && (
              <Button
                content="Nazad"
                variant="primary"
                onClick={() => {
                  context.navigation.navigate(pathname);
                  context.breadcrumbs.remove();
                }}
              />
            )}
            {isEdit && (
              <Button
                content="Sačuvaj izmjene"
                variant="primary"
                isLoading={isLoadingInsertOUArticleMutate}
                onClick={() => {
                  handleSave();
                  setIsEdit(false);
                  setIsDisabled(true);
                }}
              />
            )}
          </>
        </FormControls>
      </FormFooter>
    </ScreenWrapper>
  );
};
