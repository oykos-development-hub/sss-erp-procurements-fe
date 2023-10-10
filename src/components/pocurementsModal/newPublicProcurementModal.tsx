import {CheckIcon, Dropdown, Input, Modal, Theme} from 'client-library';
import React, {useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {dropdownArticleTypeOptions, dropdownProcurementTypeOptions, generateDropdownOptions} from '../../constants';
import useInsertPublicProcurementPlanItem from '../../services/graphql/procurements/hooks/useInsertPublicProcurementPlanItem';
import {FormGroup, ModalContentWrapper} from './styles';
import useAppContext from '../../context/useAppContext';
import useGetCounts from '../../services/graphql/counts/hooks/useGetCounts';

const initialValues = {
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
  } = useForm({defaultValues: initialValues});

  const {mutate} = useInsertPublicProcurementPlanItem();
  const [orginalTitle, setOrginalTitle] = useState<string | undefined>('');
  const {counts} = useGetCounts({level: 3});
  const dropdowncountsOptions = useMemo(() => {
    return generateDropdownOptions(counts);
  }, [counts]);

  const handleDropdownOrginalName = (id: number) => {
    const selectedItem = dropdowncountsOptions?.find(item => item.id === id);
    setOrginalTitle(selectedItem?.orginal_title);
  };
  const onSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        budget_indent_id: values?.budget_indent_id?.id,
        is_open_procurement: values?.is_open_procurement?.id === 1 ? true : false,
        title: orginalTitle,
        article_type: values?.article_type?.title,
        plan_id: planID,
        status: values?.status,
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
        budget_indent_id: {id: selectedItem?.budget_indent?.id, title: selectedItem?.budget_indent?.title},
        is_open_procurement: {
          id: selectedItem?.is_open_procurement === true ? 'Otvoreni postupak' : 'Jednostavna nabavka',
          title: selectedItem?.is_open_procurement === true ? 'Otvoreni postupak' : 'Jednostavna nabavka',
        },
        article_type: {id: selectedItem?.article_type, title: selectedItem?.article_type},
        plan_id: selectedItem?.plan?.id,
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
                  onChange={selectedOption => {
                    handleDropdownOrginalName(selectedOption.id as number);
                    onChange(selectedOption);
                  }}
                  value={value as any}
                  name={name}
                  label="KONTO:"
                  options={dropdowncountsOptions}
                  rightOptionIcon={<CheckIcon stroke={Theme.palette.primary500} />}
                  error={errors.budget_indent_id?.message as string}
                />
              )}
            />
          </FormGroup>
          <FormGroup>
            <Input label="NAZIV:" name="title" value={orginalTitle} disabled={true} />
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
