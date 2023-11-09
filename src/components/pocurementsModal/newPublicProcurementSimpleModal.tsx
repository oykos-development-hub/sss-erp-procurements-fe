import {CheckIcon, Dropdown, Input, Modal, Theme} from 'client-library';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {dropdownArticleTypeOptions, dropdownProcurementTypeOptions, generateDropdownOptions} from '../../constants';
import useInsertPublicProcurementPlanItem from '../../services/graphql/procurements/hooks/useInsertPublicProcurementPlanItem';
import {FormGroup, ModalContentWrapper} from './styles';
import useAppContext from '../../context/useAppContext';
import useGetCounts from '../../services/graphql/counts/hooks/useGetCounts';
import usePublicProcurementPlanDetails from '../../services/graphql/plans/hooks/useGetPlanDetails';
import {ProcurementItemInsert, ProcurementStatus} from '../../types/graphql/publicProcurementPlanItemDetailsTypes';
import useProcurementArticleInsert from '../../services/graphql/procurementArticles/hooks/useProcurementArticleInsert';
import {PublicProcurementArticleParams} from '../../types/graphql/publicProcurementArticlesTypes';
import {dropdownDataNumberSchema} from '../../screens/validationSchema';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';

export interface PublicProcurementModalProps {
  open: boolean;
  onClose: () => void;
  dropdownData?: any;
  fetch: () => void;
  alert: any;
  navigate: (path: string) => void;
  planID?: number;
}

export const planModalConfirmationSchema = yup.object().shape({
  budget_indent: dropdownDataNumberSchema,
  is_open_procurement: dropdownDataNumberSchema.notRequired(),
  article_type: dropdownDataNumberSchema.required('Ovo polje je obavezno'),
  title: yup.string().default(undefined).required('Ovo polje je obavezno'),
});

const defaultValues = {
  budget_indent: undefined,
  is_open_procurement: dropdownProcurementTypeOptions[1],
  article_type: undefined,
  title: '',
};

export const PublicProcurementSimpleModal: React.FC<PublicProcurementModalProps> = ({
  open,
  onClose,
  fetch,
  alert,
  navigate,
  planID,
}) => {
  const {breadcrumbs} = useAppContext();

  const {planDetails} = usePublicProcurementPlanDetails(planID);
  const {mutate: addProcurement} = useInsertPublicProcurementPlanItem();
  const {mutate: addArticle} = useProcurementArticleInsert();
  const {counts} = useGetCounts({level: 3});

  const [orginalTitle, setOrginalTitle] = useState<string | undefined>('');

  const {
    handleSubmit,
    control,
    formState: {errors},
    reset,
  } = useForm({
    resolver: yupResolver(planModalConfirmationSchema),
  });

  const dropdowncountsOptions = generateDropdownOptions(counts);

  const handleDropdownOrginalName = (id: number) => {
    const selectedItem = dropdowncountsOptions?.find(item => item.id === id);
    setOrginalTitle(selectedItem?.orginal_title);
  };
  const onSubmit = async (values: any) => {
    try {
      const payload: ProcurementItemInsert = {
        id: undefined,
        budget_indent_id: values.budget_indent?.id,
        plan_id: planID as number,
        is_open_procurement: values.is_open_procurement?.id === 1 ? true : false,
        title: values.title,
        article_type: values.article_type.title,
        status: ProcurementStatus.ProcurementStatusInProgress,
        serial_number: values.serial_number,
        date_of_publishing: undefined,
        date_of_awarding: undefined,
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
                    onChange={selectedOption => {
                      handleDropdownOrginalName(selectedOption.id as number);
                      onChange(selectedOption);
                    }}
                    value={value as any}
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
