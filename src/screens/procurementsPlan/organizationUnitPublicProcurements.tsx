import {Table, Dropdown, Input, Button} from 'client-library';
import React, {useEffect, useState} from 'react';
import {CustomDivider, MainTitle, SectionBox, SubTitle} from '../../shared/styles';
import ScreenWrapper from '../../shared/screenWrapper';
import {tableHeadsOrganizationUnitProcurements} from './constants';
import {MicroserviceProps} from '../../types/micro-service-props';
import useGetOrganizationUnitPublicProcurements from '../../services/graphql/organizationUnitPublicProcurements/hooks/useGetOrganizationUnitPublicProcurements';
import {Column, FormControls, FormFooter, Price, StatusForm, TotalValues} from './styles';
import {dropdownProcurementStatusOptions} from '../../constants';
import {calculateStatus} from '../../utils/getStatus';
import useProcurementOrganizationUnitArticleInsert from '../../services/graphql/organizationUnitPublicProcurements/hooks/usePublicProcurementOrganizationUnitArticleInsert';
import {RequestStatus} from './types';
import {checkActionRoutePermissions} from '../../services/checkRoutePermissions.ts';
import {ProcurementItemForOrganizationUnit} from '../../types/graphql/publicProcurementPlanItemDetailsTypes.ts';
import {DropdownDataNumber} from '../../types/dropdownData.ts';

interface OrganizationUnitPublicProcurementsPageProps {
  context?: MicroserviceProps;
}

export const OrganizationUnitPublicProcurements: React.FC<OrganizationUnitPublicProcurementsPageProps> = ({
  context,
}) => {
  const url = context?.navigation.location.pathname;
  const planId = +url?.split('/').at(-3);
  const organizationUnitId = +url?.split('/').at(-1);
  const updatePermittedRoutes = checkActionRoutePermissions(context?.contextMain?.permissions, 'update');
  const updatePermission = updatePermittedRoutes.includes('/procurements/plans');

  const {procurements, loading: isLoadingOUProcurements} = useGetOrganizationUnitPublicProcurements(
    planId,
    organizationUnitId,
  );
  const [form, setForm] = useState({
    status: {id: 1, title: 'Na čekanju'} as DropdownDataNumber,
    comment: '',
  });

  const breadcrumbs = context?.breadcrumbs.get();
  const title = breadcrumbs?.[breadcrumbs?.length - 1]?.name;

  const {mutate, loading: isLoadingArticleStatusMutate} = useProcurementOrganizationUnitArticleInsert();

  const articles = procurements?.map((item: any) => item?.articles).flat() || [];

  const totalNet =
    procurements?.reduce((total, item) => {
      const netPrices = item?.articles?.map(
        (article: any) => article?.amount * parseFloat(article?.public_procurement_article?.net_price),
      );
      const itemTotalPrice = netPrices?.reduce((sum: any, price: any) => sum + price, 0);
      return total + itemTotalPrice;
    }, 0) || 0;

  const totalPrice =
    procurements?.reduce((total, item) => {
      const itemTotalPrice = item?.articles?.reduce((sum: any, article: any) => {
        const netPrice = parseFloat(article?.public_procurement_article?.net_price);
        const vatPercentage = parseFloat(article?.public_procurement_article?.vat_percentage);
        const articleTotalPrice = (netPrice + (netPrice * vatPercentage) / 100) * article?.amount;
        return sum + articleTotalPrice;
      }, 0);
      return total + itemTotalPrice;
    }, 0) || 0;

  const handeChange = (value: any, name: string) => {
    setForm(prevState => ({...prevState, [name]: value}));
  };

  const changeStatus = () => {
    const articlesArr: any[] = [];
    articles?.forEach(article => {
      const payload = {
        ...article,
        public_procurement_article_id: article?.public_procurement_article?.id,
        organization_unit_id: article?.organization_unit?.id,
        status: form?.status.title === RequestStatus.Approved ? 'accepted' : 'rejected',
        is_rejected: form?.status.title === RequestStatus.Rejected,
        rejected_description: form?.comment || '',
      };
      delete payload?.public_procurement_article;
      delete payload?.organization_unit;

      articlesArr.push(payload);
    });

    mutate(articlesArr, () => {
      context?.alert.success('Status uspješno promijenjen');
      goBack();
    });
  };

  const goBack = () => {
    context?.navigation.navigate(`/procurements/plans/${planId.toString()}`, {state: {activeTab: 2}});
    context?.breadcrumbs.remove();
  };

  // there is only one comment but it's saved in every article separately so we need to fetch it
  const getComment = (procurements: ProcurementItemForOrganizationUnit[]): string => {
    for (const procurement of procurements) {
      const rejectedDescription = procurement.articles.find(
        article => article.rejected_description,
      )?.rejected_description;

      if (rejectedDescription) {
        return rejectedDescription;
      }
    }

    return '';
  };

  useEffect(() => {
    if (procurements && procurements.length > 0) {
      const status = calculateStatus(articles);

      setForm(prevState => ({
        ...prevState,
        status:
          dropdownProcurementStatusOptions.find(option => option.title === status) ??
          dropdownProcurementStatusOptions[0],
        comment: getComment(procurements),
      }));
    }
  }, [procurements]);

  return (
    <ScreenWrapper>
      <SectionBox>
        <MainTitle variant="bodyMedium" content={`${title.toUpperCase()}`} />
        <CustomDivider />
        <TotalValues>
          <Column>
            <SubTitle variant="bodySmall" content="UKUPNA VRIJEDNOST BEZ PDV-A:" />
            <Price variant="bodySmall" content={`€ ${totalNet.toFixed(2)}`} />
          </Column>
          <Column>
            <SubTitle variant="bodySmall" content="UKUPNA VRIJEDNOST SA PDV-OM:" />
            <Price variant="bodySmall" content={`€ ${totalPrice.toFixed(2)}`} />
          </Column>
        </TotalValues>
        <Table
          isLoading={isLoadingOUProcurements}
          data={procurements || []}
          tableHeads={tableHeadsOrganizationUnitProcurements}
          onRowClick={row => {
            context?.navigation.navigate(
              `/procurements/plans/${planId}/requests/${organizationUnitId}/procurement-details-requests/${row.id.toString()}`,
            );
            context?.breadcrumbs.add({
              name: `Nabavka Broj. ${row?.title || ''} / Konto: ${row?.budget_indent?.title || ''}`,
              to: `/procurements/plans/${planId}/requests/${organizationUnitId}/procurement-details-requests/${row.id.toString()}`,
            });
          }}
        />
      </SectionBox>
      <SectionBox>
        <StatusForm>
          <div>
            <Dropdown
              label="PROMIJENI STATUS:"
              options={dropdownProcurementStatusOptions}
              name="status"
              value={form?.status}
              onChange={handeChange}
              placeholder="Odaberite godinu"
            />
          </div>
          <Input
            label="KOMENTAR:"
            name="comment"
            value={form?.comment}
            onChange={(ev: any) => handeChange(ev?.target.value, 'comment')}
            textarea
          />
        </StatusForm>
      </SectionBox>
      <FormFooter>
        <FormControls>
          <Button content="Nazad" variant="secondary" onClick={goBack} />
          {updatePermission && (
            <Button
              content="Promijeni status"
              variant="primary"
              onClick={changeStatus}
              disabled={form?.status?.id === 1}
              isLoading={isLoadingArticleStatusMutate}
            />
          )}
        </FormControls>
      </FormFooter>
    </ScreenWrapper>
  );
};
