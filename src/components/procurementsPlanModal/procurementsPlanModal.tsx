import {Dropdown, Modal} from 'client-library';
import React, {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {ProcurementsPlanModalProps} from '../../screens/procurementsPlan/types';
import {yearsForDropdown} from '../../services/constants';
import useInsertPublicProcurementPlan from '../../services/graphql/plans/hooks/useInsertPublicProcurementPlan';
import useInsertPublicProcurementPlanItem from '../../services/graphql/procurements/hooks/useInsertPublicProcurementPlanItem';
import usePublicProcurementPlanDetails from '../../services/graphql/procurementsOverview/hooks/usePublicProcurementPlanDetails';
import {FormWrapper} from './styles';
import useProcurementArticleInsert from '../../services/graphql/procurementArticles/useProcurementArticleInsert';
import {DropdownDataBoolean, DropdownDataNumber} from '../../types/dropdownData';
import {yupResolver} from '@hookform/resolvers/yup';
import {planModalConfirmationSchema} from '../../screens/publicProcurement/validationSchema';
import {IS_PRE_BUDGET_OPTIONS} from './constants';

export const ProcurementsPlanModal: React.FC<ProcurementsPlanModalProps> = ({
  alert,
  fetch,
  selectedItem,
  open,
  onClose,
  dropdownData,
  navigate,
}) => {
  const {
    handleSubmit,
    control,
    formState: {errors},
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(planModalConfirmationSchema),
    defaultValues: {
      pre_budget_id: null,
    },
  });

  const [budgetIndent, initialValuesId, selectedYear] = watch(['is_pre_budget', 'pre_budget_id', 'year']);

  const {mutate: insertPlan} = useInsertPublicProcurementPlan();
  const {mutate: insertProcurement} = useInsertPublicProcurementPlanItem();
  const {mutate: addArticle} = useProcurementArticleInsert();

  const {planDetails} = usePublicProcurementPlanDetails(initialValuesId?.id || 0);

  const onSubmit = async (values: any) => {
    try {
      const payload = {
        id: values?.id,
        active: values?.active,
        serial_number: values.serial_number,
        file_id: values.file_id,
        year: values?.year?.title,
        is_pre_budget: values?.is_pre_budget?.id,
        title: values?.budgetIndent?.title + '-' + 'Plan za ' + values?.year.title,
        pre_budget_id: values?.pre_budget_id?.id || null,
        date_of_publishing: values?.date_of_publishing || null,
        date_of_closing: values?.date_of_closing || null,
      };

      insertPlan(payload, async planID => {
        if (planDetails) {
          for (const item of planDetails.items) {
            const insertItem = {
              id: 0,
              budget_indent_id: item.budget_indent.id || null,
              plan_id: planID,
              is_open_procurement: item.is_open_procurement,
              title: item.title,
              article_type: item.article_type,
              status: item.status,
              file_id: item.file_id,
            };
            await insertProcurement(insertItem, async procurementID => {
              for (const article of item.articles) {
                const insertArticle = {
                  id: 0,
                  budget_indent_id: article?.budget_indent?.id ?? 0,
                  public_procurement_id: procurementID,
                  title: article?.title,
                  description: article?.description,
                  net_price: article?.net_price,
                  vat_percentage: article?.vat_percentage,
                };
                await addArticle(insertArticle);
              }
            });
          }
        }

        fetch();
        alert.success('Uspješno ste dodali plan.');
        onClose();
        navigate(`/procurements/plans/${planID}`);
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (selectedItem) {
      reset({
        ...selectedItem,
        year: {id: +selectedItem?.year, title: selectedItem?.year},
        is_pre_budget: {
          id: selectedItem?.is_pre_budget,
          title: selectedItem?.is_pre_budget ? 'Predbudžetsko' : 'Postbudžetsko',
        },
        pre_budget_id:
          selectedItem?.pre_budget_plan.id !== 0
            ? {id: selectedItem.pre_budget_plan.id, title: selectedItem.pre_budget_plan.title}
            : null,
      });
    }
  }, [selectedItem]);

  const filteredArray = dropdownData.filter(
    (obj: DropdownDataNumber) => obj.title.includes(selectedYear?.title) || obj.title.includes('None'),
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      leftButtonText="Otkaži"
      rightButtonText="Sačuvaj"
      rightButtonOnClick={handleSubmit(onSubmit)}
      content={
        <FormWrapper>
          <Controller
            name="year"
            control={control}
            render={({field: {onChange, name, value}}) => (
              <Dropdown
                onChange={onChange}
                value={value as any}
                name={name}
                label="GODINA:"
                options={yearsForDropdown()}
                error={errors.year?.message as string}
              />
            )}
          />

          <Controller
            name="is_pre_budget"
            control={control}
            render={({field: {onChange, name, value}}) => {
              return (
                <Dropdown
                  onChange={onChange}
                  value={value as any}
                  name={name}
                  label="VRSTA:"
                  options={IS_PRE_BUDGET_OPTIONS}
                  error={errors.is_pre_budget?.message as string}
                  isDisabled={!!selectedItem}
                />
              );
            }}
          />
          <Controller
            name="pre_budget_id"
            control={control}
            render={({field: {onChange, name, value}}) => {
              return (
                <Dropdown
                  onChange={onChange}
                  value={value as any}
                  name={name}
                  label="POČETNE VRIJEDNOSTI:"
                  options={filteredArray}
                  isDisabled={!!selectedItem || budgetIndent?.id}
                />
              );
            }}
          />
        </FormWrapper>
      }
      title="NOVI PLAN"
    />
  );
};
