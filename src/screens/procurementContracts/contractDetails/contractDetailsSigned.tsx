import {
  Button,
  Dropdown,
  FileUpload,
  Input,
  MicroserviceProps,
  PlusIcon,
  TableHead,
  Theme,
  Typography,
} from 'client-library';
import React, {useEffect, useMemo, useState} from 'react';
import {OveragesModal} from '../../../components/overagesModal/overagesModal';
import {UserRole} from '../../../constants';
import useAppContext from '../../../context/useAppContext';
import useContractArticles from '../../../services/graphql/contractArticles/hooks/useContractArticles';
import useGetContractPDFUrl from '../../../services/graphql/contractPDF/useGetContractPDFUrl';
import useGetOrderProcurementAvailableArticles from '../../../services/graphql/orderProcurementAvailableArticles/hooks/useGetOrderProcurementAvailableArticles';
import useGetOrganizationUnits from '../../../services/graphql/organizationUnits/hooks/useGetOrganizationUnits';
import useProcurementContracts from '../../../services/graphql/procurementContractsOverview/hooks/useProcurementContracts';
import ScreenWrapper from '../../../shared/screenWrapper';
import {CustomDivider, Filters, MainTitle, SectionBox, TableContainer} from '../../../shared/styles';
import {DropdownDataNumber} from '../../../types/dropdownData';
import {ContractArticleGet} from '../../../types/graphql/contractsArticlesTypes';
import {parseDate} from '../../../utils/dateUtils';
import {Column, FileUploadWrapper, FormControls, FormFooter, Plan} from './styles';

interface ContractDetailsPageProps {
  context: MicroserviceProps;
}

export const ContractDetailsSigned: React.FC<ContractDetailsPageProps> = ({context}) => {
  const [filteredArticles, setFilteredArticles] = useState<ContractArticleGet[]>([]);
  const contractID = +context.navigation.location.pathname.match(/\/contracts\/(\d+)\/signed/)?.[1];
  const [uploadedFiles, setUploadedFiles] = useState<File>();
  const {organizationUnits} = useGetOrganizationUnits();
  const unitsforDropdown = useMemo(() => {
    return [
      {id: 0, title: 'Sve'},
      ...(organizationUnits?.map(unit => {
        return {id: unit.id, title: unit.title || ''};
      }) || []),
    ];
  }, [organizationUnits]);

  const {
    fileService: {downloadFile},
  } = useAppContext();

  const [selectedOrganizationUnit, setSelectedOrganizationUnit] = useState<DropdownDataNumber>(unitsforDropdown[0]);
  const [selectedItemId, setSelectedItemId] = useState(0);

  const {data: contractData} = useProcurementContracts({
    id: contractID,
  });

  const procurementID = contractData?.[0].public_procurement.id;

  const {fetchPDFUrl} = useGetContractPDFUrl({
    id: procurementID ?? 0,
    organization_unit_id: selectedOrganizationUnit.id,
  });

  const {articles, fetch: refetchAvailableArticles} = useGetOrderProcurementAvailableArticles(
    procurementID as number,
    selectedOrganizationUnit.id,
  );

  const handleUpload = (files: FileList) => {
    const fileList = Array.from(files);

    setUploadedFiles(fileList[0]);
  };

  const {
    data: contractArticles,
    loading: isLoadingContractArticles,
    refetchData: refetchContractArticles,
  } = useContractArticles(contractID, selectedOrganizationUnit.id);

  useEffect(() => {
    if (contractArticles) {
      setFilteredArticles(contractArticles);
    }
  }, [contractArticles]);

  const role = context?.contextMain?.role_id;

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
      renderContents: (_, row: any) => <Typography content={row?.amount} variant="bodySmall" />,
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
      accessor: 'overage_total',
      type: 'custom',
      renderContents: overage_total => <Typography content={overage_total} variant="bodySmall" />,
    },
    {
      title: '',
      accessor: 'TABLE_ACTIONS',
      type: 'tableActions',
      shouldRender: role !== UserRole.MANAGER_OJ,
    },
  ];

  const [showModal, setShowModal] = useState(false);

  const handleIconClick = (id: number) => {
    setSelectedItemId(id);
    setShowModal(!showModal);
  };

  const selectedItem = useMemo(() => {
    return contractArticles?.find((item: any) => item?.id === selectedItemId);
  }, [selectedItemId]);

  const refetchData = () => {
    refetchContractArticles();
    refetchAvailableArticles();
  };

  const downloadContract = async () => {
    if (contractData && contractData[0]?.file_id) {
      await downloadFile(contractData[0]?.file_id);
    }
  };

  const generatePDF = () => {
    fetchPDFUrl();
  };

  return (
    <ScreenWrapper>
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

        <FileUploadWrapper>
          <FileUpload
            icon={<></>}
            variant="secondary"
            onUpload={handleUpload}
            note={<Typography variant="bodySmall" content="Ugovor" />}
            buttonText="Učitaj"
            disabled={true}
          />
          {contractData && contractData[0]?.file_id && (
            <Button content="Preuzmi ugovor" onClick={downloadContract} style={{marginLeft: 15, width: 'auto'}} />
          )}
        </FileUploadWrapper>

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
        <Filters style={{marginBlock: '12px', alignItems: 'center', justifyContent: 'space-between'}}>
          <Column>
            <Dropdown
              label={<Typography variant="bodySmall" content="ORGANIZACIONA JEDINICA:" />}
              options={unitsforDropdown}
              value={selectedOrganizationUnit}
              onChange={val => setSelectedOrganizationUnit(val as DropdownDataNumber)}
            />
          </Column>
          <Button content="Generiši izvještaj" onClick={generatePDF} />
        </Filters>
        <TableContainer
          tableHeads={tableHeads}
          data={(contractArticles as any) || []}
          isLoading={isLoadingContractArticles}
          tableActions={[
            {
              name: 'add overages',
              onClick: (item: any) => handleIconClick(item.id),
              icon: <PlusIcon stroke={Theme?.palette?.gray800} />,
              disabled: () => selectedOrganizationUnit.id === 0,
              tooltip: () => (selectedOrganizationUnit.id === 0 ? 'Organizaciona jedinica nije odabrana' : ''),
            },
          ]}
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

      {showModal && (
        <OveragesModal
          open={!!showModal}
          onClose={handleIconClick}
          alert={context.alert}
          selectedItem={selectedItem}
          refetchData={() => refetchData()}
          organizationUnitID={selectedOrganizationUnit.id}
        />
      )}
    </ScreenWrapper>
  );
};
