import {Button, FileUpload, Input, MicroserviceProps, TableHead, Typography} from 'client-library';
import React, {useEffect, useState} from 'react';
import useContractArticles from '../../../services/graphql/contractArticles/hooks/useContractArticles';
import useProcurementContracts from '../../../services/graphql/procurementContractsOverview/hooks/useProcurementContracts';
import ScreenWrapper from '../../../shared/screenWrapper';
import {CustomDivider, Filters, MainTitle, SectionBox, TableContainer} from '../../../shared/styles';
import {ContractArticleGet} from '../../../types/graphql/contractsArticlesTypes';
import {parseDate} from '../../../utils/dateUtils';
import {Column, FileUploadWrapper, FormControls, FormFooter, Plan} from './styles';

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
