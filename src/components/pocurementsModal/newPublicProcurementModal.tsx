import {CheckIcon, Dropdown, Input, Modal, Theme} from 'client-library';
import React, {useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {dropdownArticleTypeOptions, dropdownProcurementTypeOptions, generateDropdownOptions} from '../../constants';
import useInsertPublicProcurementPlanItem from '../../services/graphql/procurements/hooks/useInsertPublicProcurementPlanItem';
import {FormGroup, ModalContentWrapper} from './styles';
import useAppContext from '../../context/useAppContext';
import useGetCounts from '../../services/graphql/counts/hooks/useGetCounts';

type InitialValuesType = {
  id: number;
  budget_indent_id?: {
    id: number;
    title: string;
  };
  plan_id: number;
  is_open_procurement: undefined;
  title: string;
  article_type: string;
  status: string;
  serial_number: string;
  date_of_publishing?: string;
  date_of_awarding?: string;
  file_id: number;
};
const initialValues: InitialValuesType = {
  id: 0,
  budget_indent_id: undefined,
  plan_id: 1,
  is_open_procurement: undefined,
  title: '',
  article_type: '',
  status: 'U toku',
  serial_number: '',
  date_of_publishing: undefined,
  date_of_awarding: undefined,
  file_id: 0,
};

export interface PublicProcurementModalProps {
  selectedItem?: any;
  open: boolean;
  onClose: () => void;
  dropdownData?: any;
  fetch: () => void;
  alert: any;
  navigate: (path: string) => void;
  planID?: number;
}

export const PublicProcurementModal: React.FC<PublicProcurementModalProps> = ({
  selectedItem,
  open,
  onClose,
  fetch,
  alert,
  navigate,
  planID,
}) => {
  const {breadcrumbs} = useAppContext();

  const {
    handleSubmit,
    control,
    formState: {errors},
    reset,
    register,
    watch,
  } = useForm({defaultValues: initialValues});

  const {mutate} = useInsertPublicProcurementPlanItem();
  const [orginalTitle, setOrginalTitle] = useState<string | undefined>('');
  const {counts} = useGetCounts({level: 3});
  const dropdowncountsOptions = useMemo(() => {
    return generateDropdownOptions(counts);
  }, [counts]);

  const budgetIndentId = watch('budget_indent_id')?.id;

  useEffect(() => {
    if (budgetIndentId === undefined) return;
    const selectedItem = dropdowncountsOptions?.find(item => item.id === budgetIndentId);
    setOrginalTitle(selectedItem?.orginal_title);
  }, [budgetIndentId, dropdowncountsOptions]);

  const onSubmit = async (values: any) => {
    try {
      const payload = {
        budget_indent_id: values?.budget_indent_id?.id,
        is_open_procurement: values?.is_open_procurement?.id,
        title: values?.title,
        article_type: values?.article_type?.title,
        plan_id: planID || 0,
        status: values?.status,
        id: values.id,
        serial_number: values?.serial_number,
        date_of_publishing: values?.date_of_publishing,
        date_of_awarding: values?.date_of_awarding,
        file_id: values?.file_id,
      };

      mutate(payload, item => {
        fetch();
        alert.success('Uspješno ste dodali javnu nabavku.');
        onClose();
        breadcrumbs.add({
          name: `Nabavka Broj. ${item.title || ''} / Konto: ${item.budget_indent?.title || ''}`,
          to: `/procurements/plans/${planID}/procurement-details/${item.id.toString()}`,
        });
        navigate(`/procurements/plans/${item.plan.id}/procurement-details/${item.id}`);
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (selectedItem) {
      reset({
        ...selectedItem,
        budget_indent_id: {id: selectedItem?.budget_indent?.id, title: selectedItem?.budget_indent?.serial_number},
        is_open_procurement: {
          id: selectedItem?.is_open_procurement === true,
          title: selectedItem?.is_open_procurement === true ? 'Otvoreni postupak' : 'Jednostavna nabavka',
        },
        article_type: {id: selectedItem?.article_type, title: selectedItem?.article_type},
        plan_id: selectedItem?.plan?.id,
        title: selectedItem?.title,
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
        <ModalContentWrapper>
          <FormGroup>
            <Controller
              name="budget_indent_id"
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Dropdown
                  onChange={onChange}
                  value={value}
                  name={name}
                  label="KONTO:"
                  options={dropdowncountsOptions}
                  rightOptionIcon={<CheckIcon stroke={Theme.palette.primary500} />}
                  error={errors.budget_indent_id?.message as string}
                  isRequired
                />
              )}
            />
          </FormGroup>
          <FormGroup>
            <Input label="NAZIV KONTA:" name="serial_number" value={orginalTitle} disabled={true} />
          </FormGroup>
          <FormGroup>
            <Input {...register('title')} label="OPIS JAVNE NABAVKE:" isRequired error={errors.title?.message} />
          </FormGroup>
          <FormGroup>
            <Controller
              name="is_open_procurement"
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Dropdown
                  onChange={onChange}
                  value={value as any}
                  name={name}
                  label="TIP POSTUPKA:"
                  options={dropdownProcurementTypeOptions}
                  rightOptionIcon={<CheckIcon stroke={Theme.palette.primary500} />}
                  error={errors.is_open_procurement?.message as string}
                  isRequired
                />
              )}
            />
          </FormGroup>
          <FormGroup>
            <Controller
              name="article_type"
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Dropdown
                  onChange={onChange}
                  value={value as any}
                  name={name}
                  label="VRSTA PREDMETA:"
                  options={dropdownArticleTypeOptions}
                  rightOptionIcon={<CheckIcon stroke={Theme.palette.primary500} />}
                  error={errors.article_type?.message as string}
                  isRequired
                />
              )}
            />
          </FormGroup>
        </ModalContentWrapper>
      }
      title={'DODAJTE NOVU JAVNU NABAVKU'}
    />
  );
};
