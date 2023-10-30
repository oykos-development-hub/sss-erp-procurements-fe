import {Button, FileUpload, Input, MicroserviceProps, TableHead, Typography} from 'client-library';
import React, {useEffect, useState} from 'react';
import useContractArticles from '../../../services/graphql/contractArticles/hooks/useContractArticles';
import useProcurementContracts from '../../../services/graphql/procurementContractsOverview/hooks/useProcurementContracts';
import ScreenWrapper from '../../../shared/screenWrapper';
import {CustomDivider, Filters, MainTitle, SectionBox, TableContainer} from '../../../shared/styles';
import {ContractArticleGet} from '../../../types/graphql/contractsArticlesTypes';
import {parseDate} from '../../../utils/dateUtils';
import {Column, FileUploadWrapper, FormControls, FormFooter, Plan} from './styles';
import useGetOrderProcurementAvailableArticles from '../../../services/graphql/orderProcurementAvailableArticles/hooks/useGetOrderProcurementAvailableArticles';

interface ContractDetailsPageProps {
  context: MicroserviceProps;
}

export const ContractDetailsSigned: React.FC<ContractDetailsPageProps> = ({context}) => {
  const [filteredArticles, setFilteredArticles] = useState<ContractArticleGet[]>([]);
  const contractID = +context.navigation.location.pathname.match(/\/contracts\/(\d+)\/signed/)?.[1];
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const {data: contractData} = useProcurementContracts({
    id: contractID,
  });

  const procurementID = contractData && contractData[0]?.public_procurement?.id;
  const {articles} = useGetOrderProcurementAvailableArticles(procurementID as any);

  const handleUpload = (files: FileList) => {
    const fileList = Array.from(files);
    setUploadedFiles(fileList);
  };

  const {data: contractArticles, loading: isLoadingContractArticles} = useContractArticles(contractID);

  useEffect(() => {
    if (contractArticles) {
      setFilteredArticles(contractArticles);
    }
  }, [contractArticles]);

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
      renderContents: (_, row: ContractArticleGet) => <Typography content={row?.net_value} variant="bodySmall" />,
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
      renderContents: (_, row: any) => <Typography content={row?.amount} />,
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
    {
      title: 'Prekoračenje',
      accessor: '',
      type: 'text',
    },
  ];
  return (
    <ScreenWrapper context={context}>
      <SectionBox>
        <MainTitle
          variant="bodyMedium"
          content={`DETALJI ZAKLJUČENOG UGOVORA:  ${contractData && contractData[0]?.serial_number}`}
          style={{marginBottom: 0}}
        />
        <CustomDivider />
        <Filters style={{marginTop: '1.5rem'}}>
          <Column>
            <Input label={'ŠIFRA UGOVORA:'} disabled={true} value={contractData && contractData[0]?.serial_number} />
          </Column>
          <Column>
            <Input
              label="DATUM ZAKLJUČENJA UGOVORA:"
              value={contractData && parseDate(contractData[0]?.date_of_signing)}
              disabled={true}
            />
          </Column>
          <Column>
            <Input
              label="DATUM ZAVRŠETKA UGOVORA:"
              value={contractData && parseDate(contractData[0]?.date_of_expiry)}
              disabled={true}
            />
          </Column>
          <Column>
            <Input label="DOBAVLJAČ:" value={contractData && contractData[0]?.supplier?.title} disabled={true} />
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
            <Input label="UKUPNA NETO VRIJEDNOST" value={contractData && contractData[0]?.net_value} disabled={true} />
          </Column>
          <Column>
            <Input
              label="UKUPNA VRIJEDNOST PDV-A"
              disabled={true}
              value={contractData && contractData[0]?.gross_value}
            />
          </Column>
          <Column>
            <Input
              label="UKUPNA VRIJEDNOST UGOVORA"
              disabled={true}
              value={contractData && contractData[0]?.vat_value}
            />
          </Column>
        </Filters>
        <Plan>
          <Typography content="POSTBUDŽETSKO" variant="bodyMedium" style={{fontWeight: 600}} />
        </Plan>
        <TableContainer
          tableHeads={tableHeads}
          data={(contractArticles as any) || []}
          isLoading={isLoadingContractArticles}
        />
      </SectionBox>

      <FormFooter>
        <FormControls>
          <Button
            content="Nazad"
            variant="secondary"
            onClick={() => {
              context.navigation.navigate('/procurements/contracts');
              context.breadcrumbs.remove();
            }}
          />
        </FormControls>
      </FormFooter>
    </ScreenWrapper>
  );
};
