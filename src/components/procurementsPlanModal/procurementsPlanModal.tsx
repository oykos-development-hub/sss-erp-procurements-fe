import {yupResolver} from '@hookform/resolvers/yup';
import {Dropdown, Input, Modal} from 'client-library';
import React, {useEffect, useMemo} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {ProcurementsPlanModalProps} from '../../screens/procurementsPlan/types';
import {planModalConfirmationSchema} from '../../screens/publicProcurement/validationSchema';
import usePublicProcurementPlanDetails from '../../services/graphql/plans/hooks/useGetPlanDetails';
import useInsertPublicProcurementPlan from '../../services/graphql/plans/hooks/useInsertPublicProcurementPlan';
import useProcurementArticleInsert from '../../services/graphql/procurementArticles/hooks/useProcurementArticleInsert';
import useInsertPublicProcurementPlanItem from '../../services/graphql/procurements/hooks/useInsertPublicProcurementPlanItem';
import {FormWrapper} from './styles';

export const ProcurementsPlanModal: React.FC<ProcurementsPlanModalProps> = ({
  alert,
  fetch,
  selectedItem,
  availableYearsForPlan,
  open,
  onClose,
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
      pre_budget_id: undefined,
    },
  });

  const [initialValuesId, selectedYear] = watch(['pre_budget_id', 'year']);

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
        is_pre_budget: false,
        title: 'Plan za ' + values?.year.title,
        pre_budget_id: values?.pre_budget_id?.id || undefined,
        date_of_publishing: values?.date_of_publishing || undefined,
        date_of_closing: values?.date_of_closing || undefined,
      };

      insertPlan(payload, async planID => {
        if (planDetails) {
          for (const item of planDetails.items) {
            const insertItem = {
              budget_indent_id: item.budget_indent?.id || null,
              plan_id: planID,
              is_open_procurement: item.is_open_procurement,
              title: item.title,
              article_type: item.article_type,
              status: item.status,
              file_id: item.file_id,
              id: undefined,
              serial_number: item.serial_number,
              date_of_publishing: item.date_of_publishing,
              date_of_awarding: item.date_of_awarding,
            };
            await insertProcurement(insertItem, async procurement => {
              for (const article of item.articles) {
                const insertArticle = {
                  public_procurement_id: procurement.id,
                  title: article?.title,
                  description: article?.description,
                  net_price: +(article?.net_price || 0),
                  vat_percentage: +article?.vat_percentage,
                  visibility_type: article.visibility_type,
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
          id: false,
          title: 'Postbudžetsko',
        },
        pre_budget_id:
          selectedItem?.pre_budget_plan.id !== 0
            ? {id: selectedItem.pre_budget_plan.id, title: selectedItem.pre_budget_plan.title}
            : undefined,
      });
    }
  }, [selectedItem]);

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
                options={availableYearsForPlan}
                error={errors.year?.message as string}
              />
            )}
          />
          <Input name="is_pre_budget" value="Postbudžetsko" label="VRSTA:" disabled />
        </FormWrapper>
      }
      title="NOVI PLAN"
    />
  );
};
