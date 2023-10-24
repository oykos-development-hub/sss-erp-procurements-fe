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

interface ContractDetailsPageProps {
  context: MicroserviceProps;
}

const initialValues = {
  serial_number: '',
  date_of_signing: '',
  date_of_expiry: '',
  supplier: {id: 0, title: ''},
};

export const ContractDetails: React.FC<ContractDetailsPageProps> = ({context}) => {
  const [filteredArticles, setFilteredArticles] = useState<any[]>([]);
  const contractID = context.navigation.location.pathname.match(/\d+/)?.[0];
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const {data: contractData, loading: isLoadingProcurementContracts} = useProcurementContracts({
    id: contractID,
  });
  const [contract] = contractData || [];

  const procurementID = contract?.public_procurement.id;
  const {procurements} = useGetOrganizationUnitPublicProcurements(undefined, undefined, procurementID);
  const [procurement] = procurements || [];

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
      setFilteredArticles(procurement?.articles || []);
    }
  }, [procurements]);

  const totalPDV = filteredArticles?.reduce((sum, article) => {
    const pdvValue =
      (Number(article?.amount || 1) *
        Number(article?.public_procurement_article?.net_price) *
        Number(article?.public_procurement_article?.vat_percentage)) /
      100;
    return sum + pdvValue;
  }, 0);

  const totalNetValue = filteredArticles?.reduce(
    (sum, article) => sum + parseFloat(article?.public_procurement_article?.net_price),
    0,
  );

  const totalPrice = filteredArticles?.reduce((sum, article) => {
    const netPrice = parseFloat(article?.public_procurement_article.net_price);
    const articleTotalPrice = article.amount
      ? Number(article.amount || 1) *
        (netPrice + (netPrice * Number(article?.public_procurement_article?.vat_percentage)) / 100)
      : netPrice + (netPrice * Number(article?.public_procurement_article?.vat_percentage)) / 100;

    return sum + articleTotalPrice;
  }, 0);

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
            public_procurement_article: {
              ...article.public_procurement_article,
              net_price: Number(value),
            },
          };
        }
        return article;
      }),
    );
  };

  const tableHeads: TableHead[] = [
    {
      title: 'Opis predmeta nabavke',
      accessor: 'public_procurement_article',
      type: 'custom',
      renderContents: public_procurement_article => (
        <Typography content={public_procurement_article?.title} variant="bodySmall" />
      ),
    },
    {
      title: 'Bitne karakteristike',
      accessor: 'public_procurement_article',
      type: 'custom',
      renderContents: public_procurement_article => (
        <Typography content={public_procurement_article?.description} variant="bodySmall" />
      ),
    },
    {
      title: 'PDV',
      accessor: 'public_procurement_article',
      type: 'custom',
      renderContents: public_procurement_article => (
        <Typography content={public_procurement_article?.vat_percentage + '%'} variant="bodySmall" />
      ),
    },
    {
      title: 'Jedinična cijena',
      accessor: 'public_procurement_article',
      type: 'custom',
      renderContents: (_, row: any) => (
        <Input
          type="number"
          value={row?.public_procurement_article?.net_price}
          onChange={event => handleInputChangeNetValue(event, row)}
          leftContent={<>€</>}
        />
      ),
    },
    {
      title: 'Količina',
      accessor: 'amount',
      type: 'custom',
      renderContents: (_, row: any) => (
        <Input type="number" value={row?.amount} onChange={event => handleInputChangeAmount(event, row)} />
      ),
    },
    {
      title: 'Ukupno',
      accessor: '',
      type: 'custom',
      renderContents: (_, row: any) => {
        const pdvValue =
          (Number(row?.public_procurement_article?.net_price) *
            Number(row?.public_procurement_article?.vat_percentage)) /
          100;
        const total = Number(row?.public_procurement_article?.net_price) + Number(pdvValue);
        const calculateTotal = total * (Number(row.amount) || 1);
        return <Typography content={`${calculateTotal?.toFixed(2)} €`} variant="bodySmall" />;
      },
    },
  ];

  const {mutate: insertContract, loading: isLoadingContractMutate} = useInsertProcurementContract();
  const {mutate: insertContractArticle, loading: isLoadingContractArticleMutate} = useInsertContractArticle();

  const handleSave = async () => {
    const insertContractData = {
      id: Number(contractID),
      public_procurement_id: contract.public_procurement.id,
      supplier_id: Number(watch('supplier').id) || Number(contract?.supplier.id),
      serial_number: watch('serial_number').toString() || contract?.serial_number.toString(),
      date_of_signing: watch('date_of_signing').toString() || parseDate(contract?.date_of_signing).toString(),
      date_of_expiry: watch('date_of_expiry').toString() || parseDate(contract?.date_of_expiry).toString(),
      net_value: totalNetValue?.toFixed(2),
      gross_value: totalPrice?.toFixed(2),
    };

    insertContract(insertContractData as any, async () => {
      if (filteredArticles) {
        let counter = 0;
        for (const item of filteredArticles) {
          const insertItem = {
            id: 0,
            public_procurement_article_id: Number(item?.public_procurement_article?.id),
            public_procurement_contract_id: Number(contractID),
            amount: item?.amount.toString(),
            net_value: item?.public_procurement_article?.net_price,
            gross_value: (
              Number(item.amount || 1) *
              (Number(item?.public_procurement_article?.net_price) +
                (Number(item?.public_procurement_article?.net_price) *
                  Number(item?.public_procurement_article?.vat_percentage)) /
                  100)
            )
              ?.toFixed(2)
              .toString(),
          };
          await insertContractArticle(
            insertItem,
            () => {
              counter++;
              if (counter === filteredArticles.length) {
                context?.alert.success('Uspješno sačuvano');
                context?.navigation.navigate(`/procurements/contracts`);
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
            <SubTitle variant="bodySmall" content="UKUPNA VRIJEDNOST PDV-A" />
            <Price variant="bodySmall" content={`€ ${totalPDV?.toFixed(2)}`} />
          </Column>
          <Column>
            <SubTitle variant="bodySmall" content="UKUPNA VRIJEDNOST UGOVORA" />
            <Price variant="bodySmall" content={`€ ${totalPrice?.toFixed(2)}`} />
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
