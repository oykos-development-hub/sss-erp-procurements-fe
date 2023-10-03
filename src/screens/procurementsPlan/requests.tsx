import {Dropdown, Table, Datepicker} from 'client-library';
import React, {useMemo, useState} from 'react';
import {OrganizationUnit} from '../../types/graphql/organizationUnitsTypes';
import {Column, DropdowWrapper, Price, Totals} from './styles';
import useGetPublicProcurementPlanRequests from '../../services/graphql/plansRequests/hooks/useGetPlanRequests';
import {ProcurementPlanDetails} from '../../types/graphql/publicProcurementPlanItemDetailsTypes';
import {parseDate} from '../../utils/dateUtils';
import {MicroserviceProps} from '../../types/micro-service-props';
import {SubTitle} from '../../shared/styles';
import {tableHeadsRequests} from './constants';
import {RequestArticle} from '../../types/graphql/planRequests';
import {DropdownDataNumber} from '../../types/dropdownData';
import {calculateStatus} from '../../utils/getStatus';

interface RequestsPageProps {
  plan?: ProcurementPlanDetails;
  context: MicroserviceProps;
  handleDateOfClosing: (date: string) => void;
}

const calculatePriceSums = (tableData: any[]) => {
  const initialSums = {netPriceSum: 0, totalPriceSum: 0};
  return tableData.reduce((accumulator, item) => {
    const netPrice = item?.amount?.netPrice || 0;
    const totalPrice = item?.amount?.totalPrice || 0;

    return {
      netPriceSum: accumulator.netPriceSum + netPrice,
      totalPriceSum: accumulator.totalPriceSum + totalPrice,
    };
  }, initialSums);
};

const filterTableData = (
  organizationUnits: OrganizationUnit[],
  requests: RequestArticle[],
  organizationUnit: DropdownDataNumber,
  plan?: ProcurementPlanDetails,
) => {
  return organizationUnits
    ?.map(item => {
      const organizationUnitsRequests = requests?.filter(request => request?.organization_unit?.id === item?.id);
      if (!organizationUnitsRequests || organizationUnitsRequests.length === 0) return null;
      const netPrice = organizationUnitsRequests.reduce((accumulator, request) => {
        const price = request?.amount * Number(request?.public_procurement_article?.net_price);
        return accumulator + price;
      }, 0);

      const status = calculateStatus(organizationUnitsRequests);

      const totalPrice = organizationUnitsRequests.reduce((accumulator, request) => {
        const price =
          Number(request?.public_procurement_article?.net_price) +
          (Number(request?.public_procurement_article?.net_price) *
            Number(request?.public_procurement_article?.vat_percentage)) /
            100;
        const requestTotal = request?.amount * price;
        return accumulator + requestTotal;
      }, 0);

      return {
        id: item?.id || 0,
        organization_unit: item?.title,
        year: plan?.year,
        is_pre_budget: plan?.is_pre_budget,
        title: plan?.title,
        date_of_publishing: plan?.date_of_publishing,
        amount: {totalPrice, netPrice},
        updated_at: plan?.updated_at ? parseDate(plan?.updated_at) : '',
        status: status?.title || '',
      };
    })
    .filter(item => (organizationUnit?.id === 0 ? item : item?.id === organizationUnit?.id));
};

export const RequestsPage: React.FC<RequestsPageProps> = ({plan, context, handleDateOfClosing}) => {
  const [organizationUnit, setOrganizationUnit] = useState({id: 0, title: 'Sve'});
  const organizationUnits: OrganizationUnit[] = context?.contextMain?.organization_units_list;
  const unitIds = useMemo(() => plan?.items.map(item => item.id) || [], [plan]);
  const {requests, loading: isLoadingPlanRequests} = useGetPublicProcurementPlanRequests(unitIds);

  const [dateOfClosing, setDateOfClosing] = useState<Date | string>('');

  const tableData = useMemo<any>(() => {
    return filterTableData(organizationUnits, requests, organizationUnit, plan);
  }, [organizationUnits, requests, organizationUnit, plan]);

  const isAllAccepted = tableData.every((item: any) => item.status === 'Odobreno');

  const priceSums = useMemo(() => {
    return calculatePriceSums(tableData);
  }, [tableData]);

  const unitsforDropdown = useMemo(() => {
    return [
      {id: 0, title: 'Sve'},
      ...(organizationUnits?.map(unit => {
        return {id: unit.id, title: unit.title};
      }) || []),
    ];
  }, [organizationUnits]);

  const handleOrganizationUnitChange = (value: any) => {
    setOrganizationUnit(value);
  };

  return (
    <div>
      <DropdowWrapper>
        <Dropdown
          name="organization_unit"
          options={unitsforDropdown}
          value={organizationUnit}
          onChange={handleOrganizationUnitChange}
          label="ORGANIZACIONA JEDINICA:"
        />
      </DropdowWrapper>
      <Table
        isLoading={isLoadingPlanRequests}
        data={tableData || []}
        tableHeads={tableHeadsRequests}
        onRowClick={row => {
          context?.navigation.navigate(`/procurements/plans/${plan?.id}/requests/${row.id.toString()}`);
          context?.breadcrumbs.add({
            name: `${row?.organization_unit} ${row?.year}`,
            to: `/procurements/plans/${plan?.id}/requests/${row.id.toString()}`,
          });
        }}
      />
      <Totals>
        <Column>
          <SubTitle variant="bodySmall" content="UKUPNA NETO VRIJEDNOST:" />
          <Price variant="bodySmall" content={`€ ${priceSums?.netPriceSum.toFixed(2)}`} />
        </Column>
        <Column>
          <SubTitle variant="bodySmall" content="UKUPNA BRUTO VRIJEDNOST:" />
          <Price variant="bodySmall" content={`€ ${priceSums?.totalPriceSum.toFixed(2)}`} />
        </Column>
      </Totals>
      <Column>
        <Datepicker
          name="date_of_closing"
          value={dateOfClosing}
          onChange={(date: any) => {
            setDateOfClosing(parseDate(date));
            isAllAccepted && handleDateOfClosing(parseDate(date));
          }}
          label={plan?.is_pre_budget ? 'Datum zaključenja:' : 'Datum objave:'}
          disabled={!isAllAccepted}
        />
      </Column>
    </div>
  );
};
