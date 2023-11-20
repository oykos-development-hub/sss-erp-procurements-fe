import {
  Button,
  Datepicker,
  Dropdown,
  FileUpload,
  Input,
  MicroserviceProps,
  TableHead,
  Typography,
} from 'client-library';
import React, {useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import FileList from '../../../components/fileList/fileList';
import useAppContext from '../../../context/useAppContext';
import useContractArticles from '../../../services/graphql/contractArticles/hooks/useContractArticles';
import useInsertContractArticle from '../../../services/graphql/contractArticles/hooks/useInsertContractArticle';
import useGetOrderProcurementAvailableArticles from '../../../services/graphql/orderProcurementAvailableArticles/hooks/useGetOrderProcurementAvailableArticles';
import useInsertProcurementContract from '../../../services/graphql/procurementContractsOverview/hooks/useInsertProcurementContract';
import useProcurementContracts from '../../../services/graphql/procurementContractsOverview/hooks/useProcurementContracts';
import usePublicProcurementGetDetails from '../../../services/graphql/procurements/hooks/useProcurementDetails';
import useGetSuppliers from '../../../services/graphql/suppliers/hooks/useGetSuppliers';
import ScreenWrapper from '../../../shared/screenWrapper';
import {CustomDivider, Filters, MainTitle, SectionBox, TableContainer} from '../../../shared/styles';
import {FileResponseItem} from '../../../types/files';
import {ContractArticleGet} from '../../../types/graphql/contractsArticlesTypes';
import {FileItem} from '../../../types/graphql/procurementContractsTypes';
import {parseDate} from '../../../utils/dateUtils';
import {Column, Controls, FileUploadWrapper, FormControls, FormFooter, Plan} from './styles';
import ImportArticlesModal from '../../../components/importArticles/importArticlesModal';

interface ContractDetailsPageProps {
  context: MicroserviceProps;
}

type ContractForm = {
  serial_number: string;
  date_of_signing: string;
  date_of_expiry: string;
  supplier: {id: number; title: string};
  vat_value: string;
  net_value: string;
  gross_value: string;
  file: FileItem[];
};

const initialValues: ContractForm = {
  serial_number: '',
  date_of_signing: '',
  date_of_expiry: '',
  supplier: {id: 0, title: ''},
  vat_value: '',
  net_value: '',
  gross_value: '',
  file: [],
};

export const ContractDetails: React.FC<ContractDetailsPageProps> = ({context}) => {
  const [filteredArticles, setFilteredArticles] = useState<ContractArticleGet[]>([]);
  const contractID = context.navigation.location.pathname.match(/\d+/)?.[0];
  const [files, setFiles] = useState<FileList | null>(null);
  const [filesToDelete, setFilesToDelete] = useState<number[]>([]);
  const [importModal, setImportModal] = useState(false);

  const {
    fileService: {uploadFile, batchDeleteFiles},
  } = useAppContext();

  const {data: contractData, loading: isLoadingProcurementContracts} = useProcurementContracts({
    id: contractID,
  });
  const {data: contractArticles} = useContractArticles(contractID);

  const [contract] = contractData || [];

  const procurementID = contract?.public_procurement.id;
  const {publicProcurement: procurement} = usePublicProcurementGetDetails(procurementID);
  const {articles, fetch} = useGetOrderProcurementAvailableArticles(procurementID, 0);

  const [defaultValuesData, setDefaultValuesData] = useState(initialValues);

  const handleUpload = (files: FileList) => {
    const allowedSize = 1048576;
    if (files && files[0] && files[0].size > allowedSize) {
      setError('file', {type: 'custom', message: 'Maksimalna veličina fajla je 1MB.'});
      return;
    } else {
      setFiles(files);
      clearErrors('file');
      context.alert.success('Fajlovi uspješno učitani');
    }
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
      file: contract?.file,
    });
  }, [contract]);

  const {
    handleSubmit,
    reset,
    register,
    formState: {errors},
    control,
    watch,
    setError,
    clearErrors,
    setValue,
  } = useForm({defaultValues: defaultValuesData});

  useEffect(() => {
    reset(defaultValuesData);
  }, [defaultValuesData, reset]);

  useEffect(() => {
    if (procurement?.articles) {
      const articles = procurement.articles.map(article => {
        const matchArticle = contractArticles?.find(
          contractArticle => contractArticle?.public_procurement_article.id === article.id,
        );
        if (matchArticle) return matchArticle;
        return {
          id: null,
          public_procurement_article: {
            id: article.id,
            title: article.title,
            vat_percentage: article.vat_percentage,
            description: article.description,
            total_amount: article.total_amount,
            net_price: article.net_price,
            amount: article.amount,
          },
          amount: article.total_amount,
          contract: {id: 0, title: ''},
          net_value: undefined,
          gross_value: undefined,
        };
      });
      setFilteredArticles(articles);
    }
  }, [procurement, contractArticles]);

  const {data: suppliers} = useGetSuppliers({id: 0, search: ''});
  const supplierOptions = useMemo(() => suppliers?.map(item => ({id: item?.id, title: item?.title})), [suppliers]);

  const handleInputChangeNetValue = (event: React.ChangeEvent<HTMLInputElement>, row: ContractArticleGet) => {
    const inputValue = event.target.value;

    // Store the input value as a string to maintain any non-numeric characters
    setFilteredArticles(articles =>
      articles.map(article => {
        if (article.public_procurement_article.id === row.public_procurement_article.id) {
          return {
            ...article,
            net_value: inputValue as any, // Store as string
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
      renderContents: article => {
        return <Typography content={article.title} variant="bodySmall" />;
      },
    },
    {
      title: 'Bitne karakteristike',
      accessor: 'public_procurement_article',
      type: 'custom',
      renderContents: article => <Typography content={article.description} variant="bodySmall" />,
    },
    {
      title: 'Jedinična cijena',
      accessor: 'public_procurement_article',
      type: 'custom',
      renderContents: (_, row: ContractArticleGet) => (
        <Input
          value={row.net_value !== undefined ? row.net_value.toString().replace(',', '.') : ''}
          onChange={event => handleInputChangeNetValue(event, row)}
          leftContent={<>€</>}
        />
      ),
    },
    {
      title: 'Ukupno neto',
      accessor: 'net_value',
      type: 'custom',
      renderContents: net_value => <Typography content={`${Number(net_value).toFixed(2)} €`} variant="bodySmall" />,
    },
    {
      title: 'Ukupno bruto',
      accessor: '',
      type: 'custom',
      renderContents: (_, row: ContractArticleGet) => {
        const pdvValue = (Number(row?.net_value || 0) * Number(row?.public_procurement_article.vat_percentage)) / 100;
        const total = (+(row?.net_value || 0) + +pdvValue) * (row.amount || 0);
        return <Typography content={`${total?.toFixed(2)} €`} variant="bodySmall" />;
      },
    },
    {
      title: 'Ugovorena količina',
      accessor: 'amount',
      type: 'custom',
      renderContents: (_, row: ContractArticleGet) => (
        <Typography content={row?.amount?.toString()} variant="bodySmall" />
      ),
    },
    {
      title: 'Dostupna količina',
      accessor: '',
      type: 'custom',
      renderContents: (_, row: ContractArticleGet) => {
        return (
          <Typography
            content={articles.find(article => article.id === row.public_procurement_article.id)?.available?.toString()}
            variant="bodySmall"
          />
        );
      },
    },
  ];

  const {mutate: insertContract, loading: isLoadingContractMutate} = useInsertProcurementContract();
  const {mutate: insertContractArticle, loading: isLoadingContractArticleMutate} = useInsertContractArticle();

  const net_value = watch('net_value');
  const gross_value = watch('gross_value');
  const vat_value = watch('vat_value');

  const calculateGrossPrice = (netPrice: number, vatPercentage: number): number => {
    return netPrice + (netPrice * vatPercentage) / 100;
  };

  const totals = useMemo(() => {
    return filteredArticles.reduce(
      (accumulator, article) => {
        const totalNetPriceForArticle = (article.amount || 0) * (article.net_value || 0);
        const grossPricePerUnit = calculateGrossPrice(
          article.net_value || 0,
          article.public_procurement_article.vat_percentage,
        );
        const totalGrossPriceForArticle = (article.amount || 0) * grossPricePerUnit;

        accumulator.totalNetValue += totalNetPriceForArticle;
        accumulator.totalGrossValue += totalGrossPriceForArticle;
        return accumulator;
      },
      {
        totalNetValue: 0,
        totalGrossValue: 0,
      },
    );
  }, [filteredArticles]);

  const handleSave = async () => {
    // Files are mandatory
    if (!files?.length && !watch('file').length) {
      setError('file', {type: 'required', message: 'Ovo polje je obavezno'});

      return;
    }

    if (files) {
      // If there are files to upload
      const formData = new FormData();
      const fileArray = Array.from(files);

      for (let i = 0; i < fileArray.length; i++) {
        formData.append('file', fileArray[i]);
      }

      await uploadFile(
        formData,
        (files: FileResponseItem[]) => {
          setFiles(null);
          setValue('file', watch('file').concat(files));
          handleInsertContract();
        },
        () => {
          context?.alert.error('Greška pri čuvanju! Fajlovi nisu učitani.');
        },
      );

      return;
    } else {
      // If no files are to be uploaded
      handleInsertContract();
    }
  };

  const handleInsertContract = async () => {
    const files = watch('file').map((item: FileItem) => item.id);

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
      file: files,
    };

    insertContract(insertContractData, async () => {
      if (filesToDelete.length) {
        await batchDeleteFiles(filesToDelete);
      }

      if (filteredArticles) {
        const items: any = filteredArticles.map(item => ({
          id: item.id,
          public_procurement_article_id: Number(item?.public_procurement_article.id),
          public_procurement_contract_id: Number(contractID),
          net_value: item?.net_value || 0,
          gross_value: +(
            Number(item.amount || 0) *
            (Number(item?.net_value) +
              (Number(item?.net_value) * Number(item?.public_procurement_article.vat_percentage)) / 100)
          )?.toFixed(2),
        }));

        await insertContractArticle(
          items,
          async () => {
            context?.alert.success('Uspješno sačuvano');
            context?.navigation.navigate('/procurements/contracts');
            context.breadcrumbs.remove();
          },
          () => {
            context?.alert.error('Greška pri čuvanju!');
          },
        );
      }
    });
  };

  const onDeleteFile = (id: number) => {
    const filteredFiles = watch('file').filter((item: FileItem) => item.id !== id);
    setValue('file', filteredFiles);
    setFilesToDelete(filesToDelete => [...filesToDelete, id]);
  };

  return (
    <ScreenWrapper>
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

        <Filters style={{marginTop: '44px'}}>
          <Column>
            <Input
              {...register('net_value', {
                required: 'Ovo polje je obavezno',
                validate: value =>
                  +value < totals.totalNetValue ? 'Obračunata neto vrijednost je veća od navedene vrijednosti.' : true,
              })}
              error={errors?.net_value?.message as string}
              label="UKUPNA NETO VRIJEDNOST"
            />
          </Column>
          <Column>
            <Input
              {...register('vat_value', {required: 'Ovo polje je obavezno'})}
              error={errors?.vat_value?.message as string}
              label="UKUPNA VRIJEDNOST PDV-A"
            />
          </Column>
          <Column>
            <Input
              {...register('gross_value', {
                required: 'Ovo polje je obavezno',
                validate: value =>
                  +value < totals.totalGrossValue
                    ? 'Obračunata bruto vrijednost je veća od navedene vrijednosti'
                    : true,
              })}
              error={errors?.gross_value?.message as string}
              label="UKUPNA VRIJEDNOST UGOVORA"
            />
          </Column>
        </Filters>

        <FileUploadWrapper>
          <FileUpload
            icon={null}
            files={files}
            variant="secondary"
            onUpload={handleUpload}
            note={<Typography variant="bodySmall" content="Ugovor" />}
            hint="Fajlovi neće biti učitani dok ne sačuvate ugovor"
            buttonText="Učitaj"
            multiple={true}
            error={errors.file?.message}
          />
        </FileUploadWrapper>
        <FileList files={watch('file')} onDelete={onDeleteFile} />

        <Controls>
          <Button content="Uvezi artikle" onClick={() => setImportModal(true)} />
        </Controls>
        <Plan>
          <Typography content="POSTBUDŽETSKO" variant="bodyMedium" style={{fontWeight: 600}} />
        </Plan>
        <TableContainer
          isLoading={isLoadingProcurementContracts}
          tableHeads={tableHeads}
          data={(filteredArticles as any) || []}
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

      <ImportArticlesModal
        onClose={() => setImportModal(false)}
        refetch={fetch}
        open={importModal}
        procurementId={procurementID}
        type="contract_articles_table"
      />
    </ScreenWrapper>
  );
};
