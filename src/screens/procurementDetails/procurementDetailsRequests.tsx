import {Button, MicroserviceProps, TableHead, Typography} from 'client-library';
import React from 'react';
import useGetOrganizationUnitPublicProcurements from '../../services/graphql/organizationUnitPublicProcurements/hooks/useGetOrganizationUnitPublicProcurements';
import useGetProcurementPlanItemLimits from '../../services/graphql/procurementPlanItemLimits/hooks/useGetProcurementPlanItemLimit';
import ScreenWrapper from '../../shared/screenWrapper';
import {CustomDivider, Filters, Header, MainTitle, SectionBox, SubTitle, TableContainer} from '../../shared/styles';
import {Column, FormControls, FormFooter, Plan, Price} from './styles';

interface ProcurementDetailsPageProps {
  context: MicroserviceProps;
}

export const ProcurementDetailsRequests: React.FC<ProcurementDetailsPageProps> = ({context}) => {
  const url = context.navigation.location.pathname;
  const procurementID = url.split('/').at(-1);
  const organizationUnitId = +url.split('/').at(-3);
  const {data: procurementPlanLimits} = useGetProcurementPlanItemLimits(procurementID);
  const {procurements, loading: isLoadingOUProcurements} = useGetOrganizationUnitPublicProcurements(
    undefined,
    +organizationUnitId,
    +procurementID,
  );
  const breadcrumbs = context?.breadcrumbs.get();
  const title = breadcrumbs?.at(-2)?.name;
  const tableHeads: TableHead[] = [
    {
      title: 'Opis predmeta nabavke',
      accessor: 'public_procurement_article',
      type: 'custom',
      renderContents: (public_procurement_article: any) => {
        return <Typography content={public_procurement_article.title} variant="bodySmall" />;
      },
    },
    {
      title: 'Bitne karakteristike',
      accessor: 'public_procurement_article',
      type: 'custom',
      renderContents: (public_procurement_article: any) => {
        return <Typography content={public_procurement_article?.description} variant="bodySmall" />;
      },
    },
    {
      title: 'Vrijednost neto',
      accessor: 'public_procurement_article',
      type: 'custom',
      renderContents: (public_procurement_article: any) => {
        return (
          <Typography content={`${Number(public_procurement_article.net_price).toFixed(2)} €`} variant="bodySmall" />
        );
      },
    },
    {
      title: 'PDV',
      accessor: 'public_procurement_article',
      type: 'custom',
      renderContents: (public_procurement_article: any, row: any) => {
        const pdvValue =
          (Number(row?.public_procurement_article?.net_price) * Number(public_procurement_article?.vat_percentage)) /
          100;
        return <Typography content={`${Number(pdvValue).toFixed(2)} €`} variant="bodySmall" />;
      },
    },
    {
      title: 'Ukupno',
      accessor: 'total',
      type: 'custom',
      renderContents: (_, row: any) => {
        const pdvValue =
          (Number(row?.public_procurement_article.net_price) * Number(row?.public_procurement_article.vat_percentage)) /
          100;
        const total = Number(row.public_procurement_article.net_price) + Number(pdvValue);

        const calculateTotal = total * (row.amount || 1);

        return <Typography content={`${calculateTotal.toFixed(2)} €`} variant="bodySmall" />;
      },
    },
    {
      title: 'Količina',
      accessor: 'amount',
      type: 'text',
    },
  ];

  const totalNet =
    procurements?.[0].articles?.reduce(
      (sum: number, article: any) => sum + parseFloat(article?.public_procurement_article?.net_price),
      0,
    ) || 0;

  const totalPrice =
    procurements?.[0].articles?.reduce((sum: number, article: any) => {
      const pdvValue =
        (Number(article?.public_procurement_article?.net_price) *
          Number(article?.public_procurement_article?.vat_percentage)) /
        100;
      const total = Number(article?.public_procurement_article.net_price) + Number(pdvValue);
      return sum + total;
    }, 0) || 0;

  const findIdForOrganisationUnit = () => {
    const desiredItem = procurementPlanLimits?.find(item => item?.organization_unit?.id === organizationUnitId);

    if (desiredItem) {
      return `€ ${desiredItem.limit}`;
    } else {
      return '';
    }
  };

  return (
    <ScreenWrapper>
      <SectionBox>
        <MainTitle
          variant="bodyMedium"
          content={`${title.toUpperCase()} - NABAVKA BROJ. ${procurements?.[0].title || ''} / KONTO: ${
            procurements?.[0]?.budget_indent?.title || ''
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
        </Header>

        <SubTitle variant="bodySmall" content={`LIMIT: ${findIdForOrganisationUnit()}`} />
        <Plan>
          <Typography
            content={procurements?.[0]?.plan?.id === 1 ? 'PREDBUDŽETSKO' : 'POSTBUDŽETSKO'}
            variant="bodyMedium"
            style={{fontWeight: 600}}
          />
        </Plan>
        <TableContainer
          tableHeads={tableHeads}
          data={procurements?.[0].articles || []}
          isLoading={isLoadingOUProcurements}
        />
      </SectionBox>

      <FormFooter>
        <FormControls>
          <Button
            content="Nazad"
            variant="primary"
            onClick={() => {
              context.navigation.navigate(-1);
              context.breadcrumbs.remove();
            }}
          />
        </FormControls>
      </FormFooter>
    </ScreenWrapper>
  );
};
