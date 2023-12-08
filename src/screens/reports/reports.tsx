import {yupResolver} from '@hookform/resolvers/yup';
import {Button, Dropdown, Input} from 'client-library';
import {useEffect, useMemo, useRef} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import useAppContext from '../../context/useAppContext';
import {dropdownDataNumberSchema, dropdownNumberSchema, requiredError} from '../../screens/validationSchema';
import useGetContractPDFUrl from '../../services/graphql/contractPDF/useGetContractPDFUrl';
import useGetOrganizationUnits from '../../services/graphql/organizationUnits/hooks/useGetOrganizationUnits';
import useGetPlanPDFUrl from '../../services/graphql/planPDF/useGetPlanPDFUrl';
import useGetPlansOverview from '../../services/graphql/plans/hooks/useGetPlans';
import useProcurementContracts from '../../services/graphql/procurementContractsOverview/hooks/useProcurementContracts';
import ScreenWrapper from '../../shared/screenWrapper';
import {DropdownDataNumber} from '../../types/dropdownData';
import {reportTypes} from './constants';
import {Column, Container, CustomDivider, Filters, Header, MainTitle} from './styles';

interface FormData {
  type_of_report: DropdownDataNumber;
  year: DropdownDataNumber;
  organization_unit_id: DropdownDataNumber | null;
  procurement: DropdownDataNumber | null;
  // Add other form fields here as needed
}

export const reportsFormValidation = yup.object().shape({
  type_of_report: dropdownDataNumberSchema,
  year: dropdownDataNumberSchema,
  organization_unit_id: yup.object(dropdownNumberSchema).nullable().default(undefined),
  procurement: yup
    .object(dropdownNumberSchema)
    .nullable()
    .when('type_of_report', {
      is: (value?: DropdownDataNumber) => value?.id === 2,
      then: schema => schema.required(requiredError),
    })
    .default(undefined),
});

export const Reports = () => {
  const {
    handleSubmit,
    control,
    formState: {errors},
    watch,
    resetField,
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(reportsFormValidation),
  });

  const {
    navigation: {
      location: {state: navigationState},
    },
    reportService: {generatePdf},
  } = useAppContext();

  const typeOfReport = watch('type_of_report');
  const year = watch('year');
  const prevYearRef = useRef<DropdownDataNumber | undefined>();
  const procurement = watch('procurement');
  const organizationUnitID = watch('organization_unit_id');

  const {data} = useGetPlansOverview({page: 1, size: 100000, is_pre_budget: false});

  const years = useMemo(() => {
    return (
      data
        ?.filter(plan => plan.items.some(item => item.contract_id))
        .map(plan => ({id: +plan.year, title: plan.year.toString()}))
        .sort((a, b) => a.id - b.id) || []
    );
  }, [data]);

  const selectedPlan = data?.find(plan => plan.year === year?.title);

  const procurementOptions = typeOfReport?.id === 2 ? selectedPlan?.items.filter(item => item.contract_id) || [] : [];

  const {data: contractData} = useProcurementContracts({
    id: selectedPlan?.items.filter(item => item.id === procurement?.id)?.[0]?.contract_id || 0,
  });

  const supplierTitle = (procurement?.id && contractData?.[0]?.supplier?.title) || '';

  const {organizationUnits} = useGetOrganizationUnits(undefined);

  const {pdfData} = useGetContractPDFUrl({
    id: procurement?.id,
    organization_unit_id: organizationUnitID?.id || 0,
  });

  const {pdfData: pdfPlanData} = useGetPlanPDFUrl({
    plan_id: selectedPlan?.id || undefined,
  });

  const onSubmit = (data: FormData) => {
    switch (data.type_of_report.id) {
      case 1:
        generatePdf('PROCUREMENT_PLAN', pdfPlanData);
        break;

      case 2:
        if (pdfData) {
          generatePdf('PROCUREMENT_CONTRACT', pdfData);
          break;
        }
    }
  };

  useEffect(() => {
    if (typeOfReport?.id === 1) {
      resetField('organization_unit_id');
    }
    if (typeOfReport?.id === 1 || (year && year?.id !== prevYearRef.current?.id)) {
      resetField('procurement');
    }
    prevYearRef.current = year;
  }, [typeOfReport, year]);

  useEffect(() => {
    if (navigationState?.reportType) {
      setValue('type_of_report', navigationState?.reportType);
    }
  }, [navigationState]);

  return (
    <ScreenWrapper>
      <Container>
        <MainTitle content="Izvještaji" variant="bodyMedium" />
        <CustomDivider />
        <Header>
          <Filters>
            <Column>
              <Controller
                name="type_of_report"
                control={control}
                render={({field: {onChange, name, value}}) => {
                  return (
                    <Dropdown
                      onChange={onChange}
                      value={value}
                      name={name}
                      label="Tip izvještaja"
                      options={reportTypes}
                      error={errors.type_of_report?.message}
                    />
                  );
                }}
              />
            </Column>
            <Column>
              <Controller
                name="year"
                control={control}
                render={({field: {onChange, name, value}}) => (
                  <Dropdown
                    name={name}
                    onChange={onChange}
                    label="Godina"
                    value={value}
                    options={years}
                    error={errors.year?.message}
                  />
                )}
              />
            </Column>
          </Filters>
          {typeOfReport?.id === 2 && (
            <Filters>
              <Column>
                <Controller
                  name="organization_unit_id"
                  control={control}
                  render={({field: {onChange, name, value}}) => (
                    <Dropdown
                      name={name}
                      onChange={onChange}
                      label="Organizaciona jedinica"
                      value={value}
                      options={[{id: 0, title: 'Sve'}, ...organizationUnits] as any}
                      error={errors.organization_unit_id?.message}
                    />
                  )}
                />
              </Column>
              <Column>
                <Controller
                  name="procurement"
                  control={control}
                  render={({field: {name, onChange, value}}) => {
                    return (
                      <Dropdown
                        onChange={onChange}
                        value={value}
                        name={name}
                        label="Nabavka:"
                        error={errors.procurement?.message}
                        options={procurementOptions}
                      />
                    );
                  }}
                />
              </Column>
              <Column>
                <Input label="DOBAVLJAČ:" value={supplierTitle} disabled={true} />
              </Column>
            </Filters>
          )}
        </Header>
        <Column>
          <Button content="Generiši izvještaj" onClick={handleSubmit(onSubmit)} />
        </Column>
      </Container>
    </ScreenWrapper>
  );
};
