import {Button, Input, MicroserviceProps, TableHead, Typography, FileUpload} from 'client-library';
import React, {useEffect, useState} from 'react';
import useContractArticles from '../../../services/graphql/contractArticles/hooks/useContractArticles';
import useProcurementContracts from '../../../services/graphql/procurementContractsOverview/hooks/useProcurementContracts';
import ScreenWrapper from '../../../shared/screenWrapper';
import {CustomDivider, Filters, MainTitle, SectionBox, SubTitle, TableContainer} from '../../../shared/styles';
import {ContractArticleGet} from '../../../types/graphql/contractsArticlesTypes';
import {Column, FileUploadWrapper, FormControls, FormFooter, Plan, Price} from './styles';
import {parseDate} from '../../../utils/dateUtils';

interface ContractDetailsPageProps {
  context: MicroserviceProps;
}

export const ContractDetailsSigned: React.FC<ContractDetailsPageProps> = ({context}) => {
  const [filteredArticles, setFilteredArticles] = useState<ContractArticleGet[]>([]);
  const contractID = context.navigation.location.pathname.match(/\/contracts\/(\d+)\/signed/)?.[1];
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const {data: contractData} = useProcurementContracts({
    id: contractID,
    procurement_id: 0,
    supplier_id: 0,
  });

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

  const totalPDV = filteredArticles.reduce((sum, article) => {
    const pdvValue =
      (Number(article?.amount || 1) *
        Number(article?.net_value) *
        Number(article?.public_procurement_article?.vat_percentage)) /
      100;
    return sum + pdvValue;
  }, 0);

  const totalPrice = filteredArticles.reduce((sum, article) => {
    const netPrice = parseFloat(article?.net_value);

    const articleTotalPrice = article.amount
      ? Number(article?.amount || 1) *
        (netPrice + (netPrice * Number(article?.public_procurement_article?.vat_percentage)) / 100)
      : netPrice + (netPrice * Number(article?.public_procurement_article?.vat_percentage)) / 100;

    return sum + articleTotalPrice;
  }, 0);

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
      accessor: 'net_value',
      type: 'custom',
      renderContents: net_value => <Typography content={net_value} />,
    },
    {
      title: 'Količina',
      accessor: 'amount',
      type: 'custom',
      renderContents: (_, row: any) => <Typography content={row?.amount} />,
    },
    {
      title: 'Ukupno',
      accessor: '',
      type: 'custom',
      renderContents: (_, row: any) => {
        const pdvValue = (Number(row?.net_value) * Number(row?.public_procurement_article?.vat_percentage)) / 100;
        const total = Number(row?.net_value) + Number(pdvValue);
        const calculateTotal = total * (Number(row?.amount) || 1);
        return <Typography content={`${calculateTotal.toFixed(2)} €`} variant="bodySmall" />;
      },
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
        <TableContainer tableHeads={tableHeads} data={contractArticles || []} isLoading={isLoadingContractArticles} />
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
