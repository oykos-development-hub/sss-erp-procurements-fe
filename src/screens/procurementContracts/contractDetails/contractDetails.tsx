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
import ImportArticlesModal from '../../../components/importArticles/importArticlesModal';
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
import {parseDateForBackend, parseToDate} from '../../../utils/dateUtils';
import {Column, Controls, FileUploadWrapper, FormControls, FormFooter, Plan} from './styles';

interface ContractDetailsPageProps {
  context: MicroserviceProps;
}

type ContractForm = {
  serial_number: string;
  date_of_signing: Date | null;
  date_of_expiry: Date | null;
  supplier: {id: number; title: string};
  vat_value: string;
  net_value: string;
  gross_value: string;
  file: FileItem[];
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
  const {data: contractArticles, refetchData} = useContractArticles(contractID);

  const [contract] = contractData || [];

  const procurementID = contract?.public_procurement.id;
  const {publicProcurement: procurement, refetch} = usePublicProcurementGetDetails(procurementID);
  const {articles} = useGetOrderProcurementAvailableArticles(procurementID, 0);

  // const [defaultValuesData, setDefaultValuesData] = useState(initialValues);

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
    reset({
      serial_number: contract?.serial_number,
      date_of_signing: parseToDate(contract?.date_of_signing),
      date_of_expiry: parseToDate(contract?.date_of_expiry),
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
  } = useForm();

  const {data: suppliers} = useGetSuppliers({id: 0, search: ''});
  const supplierOptions = useMemo(() => suppliers?.map(item => ({id: item?.id, title: item?.title})), [suppliers]);

  useEffect(() => {
    if (contractArticles) {
      setFilteredArticles(contractArticles);
    }
  }, [contractArticles]);

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
          value={row.net_value}
          onChange={event => handleInputChangeNetValue(event, row)}
          leftContent={<>€</>}
          type="price"
        />
      ),
    },
    {
      title: 'Ukupno neto',
      accessor: 'net_value',
      type: 'custom',
      renderContents: (_, row) => {
        const netValue = (Number(row.net_value) || 0) * (row.amount || 0);
        return (
          <Typography
            content={`${Number(netValue)?.toLocaleString('sr-RS', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} €`}
            variant="bodySmall"
          />
        );
      },
    },
    {
      title: 'Ukupno bruto',
      accessor: '',
      type: 'custom',
      renderContents: (_, row: ContractArticleGet) => {
        const pdvValue = row.net_value && (+row.net_value * +row.public_procurement_article.vat_percentage) / 100;
        const total = row.net_value && pdvValue && (+row.net_value + +pdvValue) * (row.amount || 0);

        return (
          <Typography
            content={`${Number(total)?.toLocaleString('sr-RS', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} €`}
            variant="bodySmall"
          />
        );
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

  const totalPrice = filteredArticles?.reduce((sum: any, article: any) => {
    const pdvValue =
      article?.net_value && (+article.net_value * +article.public_procurement_article.vat_percentage) / 100;
    const total = article?.net_value && pdvValue && (+article.net_value + +pdvValue) * (article.amount || 0);

    return sum + total;
  }, 0);

  const totalNeto = filteredArticles?.reduce((sum: any, article: any) => {
    const price = parseFloat(article?.net_value) * article?.amount;

    return sum + price;
  }, 0);

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
      date_of_signing: parseDateForBackend(watch('date_of_signing')) ?? '',
      date_of_expiry: parseDateForBackend(watch('date_of_expiry')) ?? '',
      net_value: totalNeto,
      gross_value: totalPrice,
      vat_value: undefined,
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

  const vatValue = totalPrice - totalNeto;

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
              isRequired
            />
          </Column>
          <Column>
            <Controller
              name="date_of_signing"
              control={control}
              rules={{
                required: 'Ovo polje je obavezno',
                // validate: value =>
                //   !value || new Date(value) >= value
                //     ? true
                //     : 'Datum završetka ugovora ne može biti prije datuma zaključenja ugovora.',
              }}
              render={({field: {onChange, name, value}}) => (
                <Datepicker
                  onChange={onChange}
                  label="DATUM ZAKLJUČENJA UGOVORA:"
                  name={name}
                  selected={value ? new Date(value) : ''}
                  error={errors.date_of_signing?.message}
                  isRequired
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
                  !value || new Date(value) >= value
                    ? true
                    : 'Datum završetka ugovora ne može biti prije datuma zaključenja ugovora.',
              }}
              render={({field: {onChange, name, value}}) => (
                <Datepicker
                  onChange={onChange}
                  label="DATUM ZAVRŠETKA UGOVORA:"
                  name={name}
                  selected={value ? new Date(value) : ''}
                  error={errors.date_of_expiry?.message}
                  isRequired
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
                    isRequired
                  />
                );
              }}
            />
          </Column>
        </Filters>

        <Filters style={{marginTop: '44px'}}>
          <Column>
            <Input
              value={totalNeto.toLocaleString('sr-RS', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              label="UKUPNA NETO VRIJEDNOST"
              disabled
            />
          </Column>
          <Column>
            <Input
              value={vatValue.toLocaleString('sr-RS', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              label="UKUPNA VRIJEDNOST PDV-A"
              disabled
            />
          </Column>
          <Column>
            <Input
              value={totalPrice.toLocaleString('sr-RS', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              label="UKUPNA VRIJEDNOST UGOVORA"
              disabled
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
            error={errors.file?.message as string}
          />
        </FileUploadWrapper>
        <FileList files={watch('file')} onDelete={onDeleteFile} />

        <Controls>
          <Button content="Dodaj jedinične cijene" onClick={() => setImportModal(true)} />
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
        refetch={() => {
          refetch();
          refetchData();
        }}
        open={importModal}
        procurementId={procurementID}
        contractId={contractID}
        type="contract_articles_table"
        contractArticles={procurement?.articles}
      />
    </ScreenWrapper>
  );
};
