import {yupResolver} from '@hookform/resolvers/yup';
import {CheckIcon, Dropdown, Input, Modal, Theme} from 'client-library';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import {dropdownArticleTypeOptions, dropdownProcurementTypeOptions, generateDropdownOptions} from '../../constants';
import useAppContext from '../../context/useAppContext';
import {
  dropdownDataBooleanSchema,
  dropdownDataNumberSchema,
  dropdownDataStringSchema,
} from '../../screens/validationSchema';
import useGetCounts from '../../services/graphql/counts/hooks/useGetCounts';
import useInsertPublicProcurementPlanItem from '../../services/graphql/procurements/hooks/useInsertPublicProcurementPlanItem';
import {ProcurementItemInsert, ProcurementStatus} from '../../types/graphql/publicProcurementPlanItemDetailsTypes';
import {FormGroup, ModalContentWrapper} from './styles';

export interface PublicProcurementModalProps {
  open: boolean;
  onClose: () => void;
  dropdownData?: any;
  fetch: () => void;
  alert: any;
  navigate: (path: string) => void;
  planID?: number;
  selectedItem?: any;
}

export const planModalConfirmationSchema = yup.object().shape({
  budget_indent: dropdownDataNumberSchema,
  is_open_procurement: dropdownDataBooleanSchema.notRequired(),
  article_type: dropdownDataStringSchema.required('Ovo polje je obavezno'),
  title: yup.string().default(undefined).required('Ovo polje je obavezno'),
});

export const PublicProcurementSimpleModal: React.FC<PublicProcurementModalProps> = ({
  open,
  onClose,
  fetch,
  alert,
  navigate,
  planID,
  selectedItem,
}) => {
  const {breadcrumbs} = useAppContext();

  const {mutate: addProcurement} = useInsertPublicProcurementPlanItem();
  const {counts} = useGetCounts({level: 3});

  const [orginalTitle, setOrginalTitle] = useState<string | undefined>('');

  const {
    handleSubmit,
    control,
    formState: {errors},
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(planModalConfirmationSchema),
  });

  const dropdowncountsOptions = generateDropdownOptions(counts);

  const budgetIndentId = watch('budget_indent')?.id;

  useEffect(() => {
    if (budgetIndentId === undefined) return;
    const selectedItem = dropdowncountsOptions?.find(item => item.id === budgetIndentId);
    setOrginalTitle(selectedItem?.orginal_title);
  }, [budgetIndentId, dropdowncountsOptions]);

  const onSubmit = async (values: any) => {
    try {
      const payload: ProcurementItemInsert = {
        id: values.id,
        budget_indent_id: values.budget_indent?.id,
        plan_id: planID as number,
        is_open_procurement: values.is_open_procurement?.id === 1 ? true : false,
        title: values.title,
        article_type: values.article_type.title,
        status: ProcurementStatus.ProcurementStatusInProgress,
        serial_number: values.serial_number,
        date_of_publishing: values.date_of_publishing,
        date_of_awarding: values.date_of_awarding,
        file_id: values.file_id,
      };

      await addProcurement(
        payload,
        async item => {
          fetch();
          alert.success('Uspješno ste dodali javnu nabavku.');
          onClose();
          breadcrumbs.add({
            name: `Nabavka Broj. ${item.title || ''} / Konto: ${item.budget_indent?.title || ''}`,
            to: `/procurements/plans/${planID}/procurement-details/${item.id.toString()}`,
          });
          navigate(`/procurements/plans/${item.plan.id}/procurement-details/${item.id}`);
        },
        () => {
          alert.error('Javna nabavka nije uspješno kreirana.');
        },
      );
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (selectedItem) {
      reset({
        ...selectedItem,
        budget_indent: {id: selectedItem?.budget_indent?.id, title: selectedItem?.budget_indent?.serial_number},
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
              name="budget_indent"
              control={control}
              render={({field: {onChange, name, value}}) => {
                return (
                  <Dropdown
                    onChange={onChange}
                    value={value}
                    name={name}
                    label="KONTO:"
                    options={dropdowncountsOptions}
                    rightOptionIcon={<CheckIcon stroke={Theme.palette.primary500} />}
                    error={errors.budget_indent?.message}
                  />
                );
              }}
            />
          </FormGroup>
          <FormGroup>
            <Input label="NAZIV KONTA:" name="serial_number" value={orginalTitle} disabled={true} />
          </FormGroup>
          <FormGroup>
            <Controller
              name="title"
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Input
                  onChange={onChange}
                  value={value}
                  name={name}
                  label="OPIS JAVNE NABAVKE:"
                  error={errors.title?.message}
                />
              )}
            />
          </FormGroup>
          <FormGroup>
            <Controller
              name="is_open_procurement"
              control={control}
              render={({field: {onChange, name, value}}) => (
                <Dropdown
                  onChange={onChange}
                  value={dropdownProcurementTypeOptions[1]}
                  name={name}
                  isDisabled={true}
                  label="TIP POSTUPKA:"
                  options={dropdownProcurementTypeOptions}
                  rightOptionIcon={<CheckIcon stroke={Theme.palette.primary500} />}
                  error={errors.is_open_procurement?.message}
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
                  value={value}
                  name={name}
                  label="VRSTA PREDMETA:"
                  options={dropdownArticleTypeOptions}
                  rightOptionIcon={<CheckIcon stroke={Theme.palette.primary500} />}
                  error={errors.article_type?.message}
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
