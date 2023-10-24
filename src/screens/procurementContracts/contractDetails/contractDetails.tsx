import {
  Button,
  Datepicker,
  Dropdown,
  Input,
  MicroserviceProps,
  TableHead,
  Typography,
  FileUpload,
} from 'client-library';
import React, {useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import useInsertContractArticle from '../../../services/graphql/contractArticles/hooks/useInsertContractArticle';
import useGetOrganizationUnitPublicProcurements from '../../../services/graphql/organizationUnitPublicProcurements/hooks/useGetOrganizationUnitPublicProcurements';
import useInsertProcurementContract from '../../../services/graphql/procurementContractsOverview/hooks/useInsertProcurementContract';
import useProcurementContracts from '../../../services/graphql/procurementContractsOverview/hooks/useProcurementContracts';
import useGetSuppliers from '../../../services/graphql/suppliers/hooks/useGetSuppliers';
import ScreenWrapper from '../../../shared/screenWrapper';
import {CustomDivider, Filters, MainTitle, SectionBox, SubTitle, TableContainer} from '../../../shared/styles';
import {parseDate} from '../../../utils/dateUtils';
import {Column, FileUploadWrapper, FormControls, FormFooter, Plan, Price} from './styles';
import usePublicProcurementGetDetails from '../../../services/graphql/procurements/hooks/useProcurementDetails';
import {PublicProcurementArticle} from '../../../types/graphql/publicProcurementArticlesTypes';

interface ContractDetailsPageProps {
  context: MicroserviceProps;
}

const initialValues = {
  serial_number: '',
  date_of_signing: '',
  date_of_expiry: '',
  supplier: {id: 0, title: ''},
  vat_value: '',
  net_value: '',
  gross_value: '',
};

export const ContractDetails: React.FC<ContractDetailsPageProps> = ({context}) => {
  const [filteredArticles, setFilteredArticles] = useState<PublicProcurementArticle[]>([]);
  const contractID = context.navigation.location.pathname.match(/\d+/)?.[0];
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const {data: contractData, loading: isLoadingProcurementContracts} = useProcurementContracts({
    id: contractID,
  });
  const [contract] = contractData || [];

  const procurementID = contract?.public_procurement.id;
  const {publicProcurement: procurement} = usePublicProcurementGetDetails(procurementID);

  const [defaultValuesData, setDefaultValuesData] = useState(initialValues);

  const handleUpload = (files: FileList) => {
    const fileList = Array.from(files);
    setUploadedFiles(fileList);
  };

  useEffect(() => {
    setDefaultValuesData({
      serial_number: contract?.serial_number,
      date_of_signing: contract?.date_of_signing,
      date_of_expiry: contract?.date_of_expiry,
      supplier: contract?.supplier,
      net_value: contract?.net_value,
      gross_value: contract?.gross_value,
      vat_value: contract?.vat_value,
    });
  }, [contract]);

  const {
    handleSubmit,
    reset,
    register,
    formState: {errors},
    control,
    watch,
  } = useForm({defaultValues: defaultValuesData});

  useEffect(() => {
    reset(defaultValuesData);
  }, [defaultValuesData, reset]);

  useEffect(() => {
    if (procurement?.articles) {
      const contractArticles = procurement.articles.map(article => {
        return {
          ...article,
          net_price: 0,
        };
      });
      setFilteredArticles(contractArticles);
    }
  }, [procurement]);

  const {data: suppliers} = useGetSuppliers({id: 0, search: ''});
  const supplierOptions = useMemo(() => suppliers?.map(item => ({id: item?.id, title: item?.title})), [suppliers]);

  const handleInputChangeAmount = (event: React.ChangeEvent<HTMLInputElement>, row: any) => {
    const {value} = event.target;
    setFilteredArticles(articles =>
      articles.map(article => {
        if (article.id === row.id) {
          return {...article, amount: Number(value)};
        }
        return article;
      }),
    );
  };

  const handleInputChangeNetValue = (event: React.ChangeEvent<HTMLInputElement>, row: any) => {
    const {value} = event.target;
    setFilteredArticles(articles =>
      articles.map(article => {
        if (article.id === row.id) {
          return {
            ...article,
            net_price: value !== '' ? Number(value) : undefined,
          };
        }
        return article;
      }),
    );
  };

  const tableHeads: TableHead[] = [
    {
      title: 'Opis predmeta nabavke',
      accessor: 'title',
      type: 'custom',
      renderContents: title => {
        return <Typography content={title} variant="bodySmall" />;
      },
    },
    {
      title: 'Bitne karakteristike',
      accessor: 'description',
      type: 'custom',
      renderContents: description => <Typography content={description} variant="bodySmall" />,
    },
    {
      title: 'PDV',
      accessor: 'vat_percentage',
      type: 'custom',
      renderContents: vat_percentage => <Typography content={vat_percentage + '%'} variant="bodySmall" />,
    },
    {
      title: 'Jedinična cijena',
      accessor: 'public_procurement_article',
      type: 'custom',
      renderContents: (_, row: PublicProcurementArticle) => (
        <Input
          type="number"
          value={row?.net_price?.toString() || ''}
          onChange={event => handleInputChangeNetValue(event, row)}
          leftContent={<>€</>}
        />
      ),
    },
    {
      title: 'Količina',
      accessor: 'amount',
      type: 'custom',
      renderContents: (_, row: PublicProcurementArticle) => (
        <Input
          type="number"
          value={row?.total_amount.toString()}
          onChange={event => handleInputChangeAmount(event, row)}
        />
      ),
    },
    {
      title: 'Ukupno',
      accessor: '',
      type: 'custom',
      renderContents: (_, row: PublicProcurementArticle) => {
        const pdvValue = (Number(row?.net_price || 0) * Number(row?.vat_percentage)) / 100;
        const total = Number(row?.net_price || 0) + Number(pdvValue);
        const calculateTotal = total * (Number(row.total_amount) || 1);
        return <Typography content={`${calculateTotal?.toFixed(2)} €`} variant="bodySmall" />;
      },
    },
  ];

  const {mutate: insertContract, loading: isLoadingContractMutate} = useInsertProcurementContract();
  const {mutate: insertContractArticle, loading: isLoadingContractArticleMutate} = useInsertContractArticle();

  const net_value = watch('net_value');
  const gross_value = watch('gross_value');
  const vat_value = watch('vat_value');

  const handleSave = async () => {
    const insertContractData = {
      id: +contractID,
      public_procurement_id: contract.public_procurement.id,
      supplier_id: Number(watch('supplier').id) || Number(contract?.supplier.id),
      serial_number: watch('serial_number').toString() || contract?.serial_number.toString(),
      date_of_signing: watch('date_of_signing').toString() || parseDate(contract?.date_of_signing).toString(),
      date_of_expiry: watch('date_of_expiry').toString() || parseDate(contract?.date_of_expiry).toString(),
      net_value: net_value,
      gross_value: gross_value,
      vat_value: vat_value,
    };

    insertContract(insertContractData, async () => {
      if (filteredArticles) {
        let counter = 0;
        for (const item of filteredArticles) {
          const insertItem = {
            id: 0,
            public_procurement_article_id: Number(item?.id),
            public_procurement_contract_id: Number(contractID),
            amount: item?.total_amount,
            net_value: item?.net_price || 0,
            gross_value: +(
              Number(item.total_amount || 1) *
              (Number(item?.net_price) + (Number(item?.net_price) * Number(item?.vat_percentage)) / 100)
            )?.toFixed(2),
          };
          await insertContractArticle(
            insertItem,
            () => {
              counter++;
              if (counter === filteredArticles.length) {
                context?.alert.success('Uspješno sačuvano');
                context?.navigation.navigate('/procurements/contracts');
                context.breadcrumbs.remove();
              }
            },
            () => {
              context?.alert.error('Greška pri čuvanju!');
            },
          );
        }
      }
    });
  };

  return (
    <ScreenWrapper context={context}>
      <SectionBox>
        <MainTitle
          variant="bodyMedium"
          content={`DETALJI UGOVORA: ${contract?.serial_number}`}
          style={{marginBottom: 0}}
        />
        <CustomDivider />

        <Filters style={{marginTop: '1.5rem'}}>
          <Column>
            <Input
              {...register('serial_number', {required: 'Ovo polje je obavezno'})}
              label={'ŠIFRA UGOVORA:'}
              error={errors?.serial_number?.message as string}
            />
          </Column>
          <Column>
            <Controller
              name="date_of_signing"
              control={control}
              rules={{
                required: 'Ovo polje je obavezno',
                validate: value =>
                  !value || !watch('date_of_signing') || new Date(value) >= new Date(watch('date_of_signing'))
                    ? true
                    : 'Datum završetka ugovora ne može biti prije datuma zaključenja ugovora.',
              }}
              render={({field: {onChange, name, value}}) => (
                <Datepicker
                  onChange={onChange}
                  label="DATUM ZAKLJUČENJA UGOVORA:"
                  name={name}
                  value={value ? parseDate(value) : ''}
                  error={errors.date_of_signing?.message}
                />
              )}
            />
          </Column>
          <Column>
            <Controller
              name="date_of_expiry"
              control={control}
              rules={{
                required: 'Ovo polje je obavezno',
                validate: value =>
                  !value || !watch('date_of_signing') || new Date(value) >= new Date(watch('date_of_signing'))
                    ? true
                    : 'Datum završetka ugovora ne može biti prije datuma zaključenja ugovora.',
              }}
              render={({field: {onChange, name, value}}) => (
                <Datepicker
                  onChange={onChange}
                  label="DATUM ZAVRŠETKA UGOVORA:"
                  name={name}
                  value={value ? parseDate(value) : ''}
                  error={errors.date_of_expiry?.message}
                />
              )}
            />
          </Column>
          <Column>
            <Controller
              name="supplier"
              control={control}
              rules={{validate: value => (value?.title === '' ? 'Izaberi dobavljača' : true)}}
              render={({field: {onChange, name, value}}) => {
                return (
                  <Dropdown
                    onChange={onChange}
                    value={value}
                    name={name}
                    label="DOBAVLJAČ:"
                    options={supplierOptions || []}
                    error={errors?.supplier?.message as string}
                  />
                );
              }}
            />
          </Column>
        </Filters>

        <Filters style={{marginTop: '10px'}}>
          <Column>
            <FileUploadWrapper>
              <FileUpload
                icon={<></>}
                style={{width: '100%'}}
                variant="secondary"
                onUpload={handleUpload}
                note={<Typography variant="bodySmall" content="Ugovor" />}
                buttonText="Učitaj"
              />
            </FileUploadWrapper>
          </Column>
        </Filters>

        <Filters style={{marginTop: '44px'}}>
          <Column>
            <Input
              {...register('net_value', {required: 'Ovo polje je obavezno'})}
              error={errors?.net_value?.message as string}
              label="UKUPNA NETO VRIJEDNOST"
            />
          </Column>
          <Column>
            <Input
              {...register('gross_value', {required: 'Ovo polje je obavezno'})}
              error={errors?.gross_value?.message as string}
              label="UKUPNA VRIJEDNOST PDV-A"
            />
          </Column>
          <Column>
            <Input
              {...register('vat_value', {required: 'Ovo polje je obavezno'})}
              error={errors?.vat_value?.message as string}
              label="UKUPNA VRIJEDNOST UGOVORA"
            />
          </Column>
        </Filters>

        <Plan>
          <Typography content="POSTBUDŽETSKO" variant="bodyMedium" style={{fontWeight: 600}} />
        </Plan>
        <TableContainer
          isLoading={isLoadingProcurementContracts}
          tableHeads={tableHeads}
          data={filteredArticles || []}
        />
      </SectionBox>

      <FormFooter>
        <FormControls>
          <Button
            content="Odustani"
            variant="secondary"
            onClick={() => {
              context.navigation.navigate('/procurements/contracts');
              context.breadcrumbs.remove();
            }}
          />
          <Button
            content="Sačuvaj ugovor"
            variant="primary"
            onClick={handleSubmit(handleSave)}
            isLoading={isLoadingContractMutate || isLoadingContractArticleMutate}
          />
        </FormControls>
      </FormFooter>
    </ScreenWrapper>
  );
};
