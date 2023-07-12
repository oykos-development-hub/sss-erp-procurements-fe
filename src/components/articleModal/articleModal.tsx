import {Dropdown, Input, Modal, Theme} from 'client-library';
import React, {useEffect, useMemo} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {dropdownBudgetIndentOptions, pdvOptions} from '../../constants';
import useProcurementArticleInsert from '../../services/graphql/procurementArticles/useProcurementArticleInsert';
import {FormWrapper, Row} from './styles';
import {formatData} from './utils';

const initialValues = {
  id: 0,
  budget_indent_id: 0,
  public_procurement_id: 0,
  title: '',
  description: '',
  net_price: '',
  vat_percentage: '',
  total_price: '',
};

interface ArticleModalProps {
  selectedItem?: any;
  open: boolean;
  onClose: (refetch?: any, message?: any) => void;
  procurementId?: number;
  alert?: any;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({selectedItem, open, onClose, procurementId, alert}) => {
  const item = useMemo(() => {
    return selectedItem
      ? {
          ...selectedItem,
          public_procurement_id: selectedItem?.public_procurement_id || procurementId,
          vat_percentage: {id: Number(selectedItem?.vat_percentage) || 0, title: `${selectedItem?.vat_percentage} %`},
          total_price: '',
        }
      : {...initialValues, public_procurement_id: procurementId};
  }, [selectedItem]);

  const {
    register,
    handleSubmit,
    control,
    formState: {errors},
    reset,
    setValue,
    watch,
  } = useForm({defaultValues: item || initialValues});

  const {mutate: addArticle} = useProcurementArticleInsert();

  const netPrice = watch('net_price');
  const pdv = watch('vat_percentage');

  const onSubmit = (data: any) => {
    const payload = formatData({
      ...data,
      public_procurement_id: data.public_procurement_id || procurementId,
    });
    addArticle(
      payload,
      () => {
        onClose(true);
        alert.success('Artikal je uspješno sačuvan!');
      },
      () => {
        onClose(false);
        alert?.error('Greška prilikom čuvanja artikla!');
      },
    );
  };

  useEffect(() => {
    if (item) {
      reset(item);
    }
  }, [item]);

  useEffect(() => {
    if (netPrice && pdv) {
      const price = Number(netPrice) + (Number(netPrice) * Number(pdv?.id)) / 100;
      setValue('total_price', price.toFixed(2));
    }
  }, [netPrice, pdv]);

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
      }}
      leftButtonText="Otkaži"
      rightButtonText="Dodaj artikal"
      rightButtonOnClick={handleSubmit(onSubmit)}
      content={
        <FormWrapper>
          <Row>
            <Controller
              name="budget_indent"
              control={control}
              render={({field: {onChange, name, value}}) => {
                return (
                  <Dropdown
                    onChange={onChange}
                    value={value as any}
                    name={name}
                    label="POD KONTO:"
                    options={dropdownBudgetIndentOptions}
                    error={errors.budget_indent?.message as string}
                  />
                );
              }}
            />
            <Input
              {...register('title', {required: 'Ovo polje je obavezno'})}
              label="OPIS PREDMETA NABAVKE:"
              error={errors.title?.message as string}
            />
          </Row>
          <Row>
            <Input
              {...register('description', {required: 'Ovo polje je obavezno'})}
              label="BITNE KARAKTERISTIKE PREDMETA NABAVKE:"
              error={errors.description?.message as string}
            />
            <Input
              {...register('net_price', {required: 'Ovo polje je obavezno'})}
              label="JEDINIČNA CIJENA BEZ PDV-A (Vrijednost neto):"
              error={errors.net_price?.message as string}
              leftContent={<div>€</div>}
            />
          </Row>
          <Row>
            <Controller
              name="vat_percentage"
              rules={{required: 'Ovo polje je obavezno'}}
              control={control}
              render={({field: {onChange, name, value}}) => {
                const pdvValue = (Number(netPrice) * Number(pdv?.id)) / 100;
                const valueToShow = pdvValue
                  ? {id: value?.id, title: `${value.title}   (${pdvValue.toFixed(2)} €)`}
                  : value;
                return (
                  <Dropdown
                    onChange={onChange}
                    value={valueToShow as any}
                    name={name}
                    label="PDV:"
                    options={pdvOptions}
                    error={errors.vat_percentage?.message as string}
                  />
                );
              }}
            />
            <Input
              {...register('total_price')}
              label="JEDINIČNA CIJENA SA PDV-OM:"
              leftContent={<div style={{color: Theme?.palette?.gray300}}>€</div>}
              disabled
            />
          </Row>
        </FormWrapper>
      }
      title={'DODAJTE NOVI ARTIKAL'}
    />
  );
};
