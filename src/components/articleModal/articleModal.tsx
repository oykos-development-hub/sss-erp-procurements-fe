import {yupResolver} from '@hookform/resolvers/yup';
import {Dropdown, Input, Modal} from 'client-library';
import React, {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {pdvOptions} from '../../constants.ts';
import useProcurementArticleInsert from '../../services/graphql/procurementArticles/hooks/useProcurementArticleInsert';
import {
  PublicProcurementArticleParams,
  getVisibilityOptions,
  getVisibilityTypeName,
} from '../../types/graphql/publicProcurementArticlesTypes.ts';
import {PublicProcurement} from '../../types/graphql/publicProcurementTypes.ts';
import {FormGroup, FormWrapper, Row} from './styles';
import {articleModalConfirmationSchema} from './validationSchema.ts';

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
  const totalPrice = watch('total_price');

  useEffect(() => {
    if (selectedItem) {
      reset({
        ...selectedItem,
        public_procurement_id: selectedItem?.public_procurement_id || procurementId,
        vat_percentage: {id: Number(selectedItem?.vat_percentage) || 0, title: `${selectedItem?.vat_percentage} %`},
        total_price: '',
        visibility_type: {
          id: selectedItem?.visibility_type,
          title: getVisibilityTypeName(selectedItem?.visibility_type),
        },
      });
    }
  }, [selectedItem]);

  const onSubmit = (data: any) => {
    const payload: PublicProcurementArticleParams = {
      id: data?.id,
      public_procurement_id: data.public_procurement_id || procurementId,
      title: data.title,
      description: data.description,
      net_price: parseFloat(netPrice.toString().replace(',', '.')),
      vat_percentage: data.vat_percentage?.id.toString(),
      visibility_type: data?.visibility_type?.id,
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
      const NetPrice = netPrice.toString().replace(',', '.');
      const price = Number(NetPrice) + (Number(NetPrice) * Number(pdv?.id)) / 100;
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
            <Input
              {...register('title')}
              label="NAZIV PREDMETA NABAVKE:"
              error={errors.title?.message as string}
              isRequired
            />
          </FormGroup>
          <Row>
            <Input
              {...register('description')}
              label="BITNE KARAKTERISTIKE PREDMETA NABAVKE:"
              error={errors.description?.message}
              isRequired
            />
            <Input
              {...register('net_price')}
              label="JEDINIČNA CIJENA BEZ PDV-A:"
              error={errors.net_price?.message}
              leftContent={<div>€</div>}
              isRequired
              value={netPrice?.toString().replace('.', ',')}
            />
          </Row>
          <Row>
            <Controller
              name="vat_percentage"
              control={control}
              render={({field: {onChange, name, value}}) => {
                const NetPrice = netPrice?.toString().replace(',', '.');
                const pdvValue = (Number(NetPrice) * Number(pdv?.id)) / 100;
                const valueToShow = value
                  ? {
                      id: value?.id,
                      title: `${value.title}   (${
                        pdvValue.toLocaleString('sr-RS', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }) || 0
                      } €)`,
                    }
                  : undefined;
                return (
                  <Dropdown
                    onChange={onChange}
                    value={valueToShow}
                    name={name}
                    label="PDV:"
                    options={pdvOptions}
                    error={errors.vat_percentage?.message}
                    isRequired
                  />
                );
              }}
            />

            <Input
              {...register('total_price')}
              label="JEDINIČNA CIJENA SA PDV-OM:"
              leftContent={<div>€</div>}
              value={totalPrice?.toString().replace('.', ',')}
              isRequired
              disabled
            />
          </Row>
          <Row>
            <Controller
              name="visibility_type"
              control={control}
              render={({field: {onChange, name, value}}) => {
                return (
                  <Dropdown
                    onChange={onChange}
                    value={value}
                    name={name}
                    label="MODUL:"
                    options={getVisibilityOptions()}
                    error={errors.vat_percentage?.message}
                    isRequired
                  />
                );
              }}
            />
            {!procurementItem?.is_open_procurement && (
              <Input
                type="number"
                inputMode="numeric"
                {...register('amount')}
                label="KOLIČINA:"
                error={errors.amount?.message}
                isRequired
              />
            )}
          </Row>
        </FormWrapper>
      }
      title={'DODAJTE NOVI ARTIKAL'}
    />
  );
};
