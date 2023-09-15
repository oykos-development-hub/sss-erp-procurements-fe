import {Dropdown, Modal} from 'client-library';
import React, {useEffect, useMemo} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {ProcurementsPlanModalProps} from '../../screens/procurementsPlan/types';
import {yearsForDropdown} from '../../services/constants';
import useInsertPublicProcurementPlan from '../../services/graphql/plans/hooks/useInsertPublicProcurementPlan';
import useInsertPublicProcurementPlanItem from '../../services/graphql/procurements/hooks/useInsertPublicProcurementPlanItem';
import usePublicProcurementPlanDetails from '../../services/graphql/procurementsOverview/hooks/usePublicProcurementPlanDetails';
import {FormWrapper} from './styles';
import useProcurementArticleInsert from '../../services/graphql/procurementArticles/useProcurementArticleInsert';
import { DropdownDataNumber } from '../../types/dropdownData';

const initialValues = {
  id: 0,
  pre_budget_id: {id: 0, title: ''},
  is_pre_budget: undefined,
  active: false,
  year: {id: 0, title: ''},
  title: '',
  serial_number: '',
  date_of_publishing: '',
  date_of_closing: '',
  file_id: 0,
};

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
  } = useForm({defaultValues: initialValues});

  const yearOptions = useMemo(
    () => yearsForDropdown().map(year => ({id: year.id.toString(), title: year.title.toString()})),
    [],
  );

  const budgetIndent = watch('is_pre_budget');
  const selectedYear = watch('year');
  const initialValuesId = watch('pre_budget_id');
  let budgetIndentFlag = '';
  if (budgetIndent) {
    budgetIndentFlag = budgetIndent['title'];
  }

  const {mutate: insertPlan} = useInsertPublicProcurementPlan();
  const {mutate: insertProcurement} = useInsertPublicProcurementPlanItem();
  const {mutate: addArticle} = useProcurementArticleInsert();

  const {planDetails} = usePublicProcurementPlanDetails(initialValuesId?.id);

  const onSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        year: values?.year?.title,
        is_pre_budget: values?.is_pre_budget?.id === 1 ? true : false,
        title: budgetIndentFlag + '-' + 'Plan za ' + values?.year.title,
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
            await insertProcurement(insertItem as any, async procurementID => {
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
                await addArticle(insertArticle as any);
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
        year: {id: Number(selectedItem?.year), title: selectedItem?.year},
        is_pre_budget: {
          id: selectedItem?.is_pre_budget === true ? 1 : 2,
          title: selectedItem?.is_pre_budget === true ? 'Predbudžetsko' : 'Postbudžetsko',
        },
        pre_budget_id: {id: selectedItem?.pre_budget_id, title: selectedItem?.pre_budget_id},
      });
    }
  }, [selectedItem]);

  const filteredArray = dropdownData.filter(
    (obj: DropdownDataNumber) => obj.title.includes(selectedYear.title) || obj.title.includes('None'),
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
            rules={{required: 'Ovo polje je obavezno'}}
            render={({field: {onChange, name, value}}) => (
              <Dropdown
                onChange={onChange}
                value={value}
                name={name}
                label="GODINA:"
                options={yearOptions}
                error={errors.year?.message as string}
              />
            )}
          />

          <Controller
            name="is_pre_budget"
            rules={{required: 'Ovo polje je obavezno'}}
            control={control}
            render={({field: {onChange, name, value}}) => {
              return (
                <Dropdown
                  onChange={onChange}
                  value={value as any}
                  name={name}
                  label="VRSTA:"
                  options={[
                    {
                      id: 1,
                      title: 'Predbudžetsko',
                    },
                    {id: 2, title: 'Postbudžetsko'},
                  ]}
                  error={errors.is_pre_budget?.message as string}
                  isDisabled={selectedItem ? true : false}
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
                  isDisabled={selectedItem || budgetIndentFlag === 'Predbudžetsko' ? true : false}
                  error={errors.pre_budget_id?.message as string}
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
