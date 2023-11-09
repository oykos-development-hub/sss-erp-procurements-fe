import {Dropdown, Input, Modal, Theme} from 'client-library';
import React, {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import useProcurementArticleInsert from '../../services/graphql/procurementArticles/hooks/useProcurementArticleInsert';
import {FormGroup, FormWrapper, Row} from './styles';
import {yupResolver} from '@hookform/resolvers/yup';
import {articleModalConfirmationSchema} from './validationSchema.ts';
import {pdvOptions} from '../../constants.ts';
import {PublicProcurement} from '../../types/graphql/publicProcurementTypes.ts';
import {PublicProcurementArticleParams} from '../../types/graphql/publicProcurementArticlesTypes.ts';

interface ArticleModalProps {
  selectedItem?: any;
  procurementItem?: PublicProcurement;
  open: boolean;
  onClose: (refetch?: any, message?: any) => void;
  procurementId?: number;
  alert?: any;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  selectedItem,
  procurementItem,
  open,
  onClose,
  procurementId,
  alert,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: {errors},
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(articleModalConfirmationSchema),
  });

  const {mutate: addArticle} = useProcurementArticleInsert();

  const netPrice = watch('net_price');
  const pdv = watch('vat_percentage');

  useEffect(() => {
    if (selectedItem) {
      reset({
        ...selectedItem,
        public_procurement_id: selectedItem?.public_procurement_id || procurementId,
        vat_percentage: {id: Number(selectedItem?.vat_percentage) || 0, title: `${selectedItem?.vat_percentage} %`},
        total_price: '',
      });
    }
  }, [selectedItem]);

  const onSubmit = (data: any) => {
    const payload: PublicProcurementArticleParams = {
      id: data?.id,
      public_procurement_id: data.public_procurement_id || procurementId,
      title: data.title,
      description: data.description,
      net_price: parseFloat(data.net_price),
      vat_percentage: data.vat_percentage?.id.toString(),
    };

    if (!procurementItem?.is_open_procurement) {
      payload.amount = data.amount;
    }

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
          <FormGroup>
            <Input {...register('title')} label="NAZIV PREDMETA NABAVKE:" error={errors.title?.message as string} />
          </FormGroup>
          <Row>
            <Input
              {...register('description')}
              label="BITNE KARAKTERISTIKE PREDMETA NABAVKE:"
              error={errors.description?.message}
            />
            <Input
              {...register('net_price')}
              label="JEDINIČNA CIJENA BEZ PDV-A (Vrijednost neto):"
              error={errors.net_price?.message}
              leftContent={<div>€</div>}
            />
          </Row>
          <Row>
            <Controller
              name="vat_percentage"
              control={control}
              render={({field: {onChange, name, value}}) => {
                const pdvValue = (Number(netPrice) * Number(pdv?.id)) / 100;
                const valueToShow = value
                  ? {id: value?.id, title: `${value.title}   (${pdvValue.toFixed(2) || 0} €)`}
                  : undefined;
                return (
                  <Dropdown
                    onChange={onChange}
                    value={valueToShow}
                    name={name}
                    label="PDV:"
                    options={pdvOptions}
                    error={errors.vat_percentage?.message}
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
          {!procurementItem?.is_open_procurement && (
            <Row>
              <Input
                type="number"
                inputMode="numeric"
                {...register('amount')}
                label="KOLIČINA:"
                error={errors.amount?.message}
              />
            </Row>
          )}
        </FormWrapper>
      }
      title={'DODAJTE NOVI ARTIKAL'}
    />
  );
};
