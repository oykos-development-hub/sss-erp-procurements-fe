import {Button, FileUpload, Typography} from 'client-library';
import ExcelJS from 'exceljs';
import {useState} from 'react';
import useAppContext from '../../context/useAppContext';
import {REQUEST_STATUSES} from '../../services/constants';
import useInsertContractArticle from '../../services/graphql/contractArticles/hooks/useInsertContractArticle';
import useProcurementArticleInsert from '../../services/graphql/procurementArticles/hooks/useProcurementArticleInsert';
import {uploadArticlesXls, uploadContractArticlesXls} from '../../services/uploadArticlesXls';
import {ContractArticleInsert} from '../../types/graphql/contractsArticlesTypes';
import {
  PublicProcurementArticle,
  PublicProcurementArticleParams,
} from '../../types/graphql/publicProcurementArticlesTypes';
import {CustomFooter, CustomModal, FooterText, ModalButtons, TemplateDownloadButton} from './styles';

// This component is used for generating articles in procurement plans and contracts.
// 1. In case of plans, excel file is to be downloaded from the server, filled in and uploaded back.
// 2. In case of contracts, excel file is to be downloaded from the server, updated from the contractArticles props, filled in (only price), and uploaded back.

export const staticFileNameMap = {
  article_table: 'tabela_za_dodavanje_artikala.xlsx',
  contract_articles_table: 'tabela_za_artikl_ugovora.xlsx',
  simple_procurement_table: 'tabela_za_dodavanje_artikala_jednostavna_nabavka.xlsx',
};

const missingFileError = 'Morate učitati fajl!';
const emptyTableError = 'Tabela je prazna!';

type ImportArticlesModalProps = {
  onClose: () => void;
  refetch: () => void;
  open: boolean;
  procurementId: number;
  contractId?: number;
  type: keyof typeof staticFileNameMap;
  contractArticles?: PublicProcurementArticle[];
};

const ImportArticlesModal = ({
  onClose,
  open,
  procurementId,
  refetch,
  type,
  contractArticles = [],
  contractId,
}: ImportArticlesModalProps) => {
  const isContractArticles = type === 'contract_articles_table';
  const [files, setFiles] = useState<FileList | null>(null);
  const [articles, setArticles] = useState<PublicProcurementArticleParams[]>([]);
  const [filledContractArticles, setFilledContractArticles] = useState<ContractArticleInsert[]>([]);
  const [error, setError] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);

  const {
    alert,
    fileService: {
      downloadStaticFile,
      helpers: {download},
    },
  } = useAppContext();
  const {mutate: addArticles, loading} = useProcurementArticleInsert();
  const {mutate: addContractArticles} = useInsertContractArticle();

  const handleUpload = async (files: FileList) => {
    setUploadLoading(true);
    setFiles(files);
    setError('');

    let response;
    // article_table
    if (isContractArticles) {
      if (files.length && procurementId && contractId) {
        response = await uploadContractArticlesXls(files[0], procurementId, contractId);
        if (response?.status === REQUEST_STATUSES.success) {
          if (response?.data?.length) {
            setFilledContractArticles(response?.data);
          } else {
            setError(emptyTableError);
          }
        } else {
          alert.error('Došlo je do greške prilikom učitavanja fajla!');
        }
      } else {
        setFilledContractArticles([]);
      }
    } else {
      if (files.length && procurementId) {
        response = await uploadArticlesXls(files[0], procurementId, type === 'simple_procurement_table');
        if (response?.status === REQUEST_STATUSES.success) {
          if (response?.data?.length) {
            setArticles(response?.data);
          } else {
            setError(emptyTableError);
          }
        } else {
          alert.error('Došlo je do greške prilikom učitavanja fajla!');
        }
      } else {
        setArticles([]);
      }
    }

    setUploadLoading(false);
  };

  const handleSubmitPlanArticles = async () => {
    if (articles && !articles.length && !error) {
      setError(missingFileError);
      return;
    }

    if (error) return;

    await addArticles(articles, () => {
      alert.success('Artikli uspješno uvezeni');
      refetch();
      handleClose();
    });
  };

  const handleSubmitContractArticles = async () => {
    if (filledContractArticles && !filledContractArticles.length && !error) {
      setError(missingFileError);
      return;
    }

    if (error) return;

    const articles = filledContractArticles.map(item => ({
      id: item.id,
      public_procurement_article_id: item.public_procurement_article_id,
      public_procurement_contract_id: item.public_procurement_contract_id,
      net_value: item?.net_value,
      gross_value: item.gross_value,
    }));

    await addContractArticles(articles, () => {
      alert.success('Artikli uspješno uvezeni');
      refetch();
      handleClose();
    });
  };

  const handleClose = () => {
    setFiles(null);
    setError('');
    onClose();
  };

  const downloadTemplate = async () => {
    if (isContractArticles) {
      await getContractTable();
    } else {
      await downloadStaticFile(staticFileNameMap[type], {
        onSuccess: () => {
          alert.success('Uspješno preuzet fajl');
        },
        onError: () => {
          alert.error('Došlo je do greške prilikom preuzimanja fajla');
        },
        // Do not download the file automatically if this is for contract articles
        // because in this case there is some editing to be done on the xlsx file
        download: !isContractArticles,
      });
    }
  };

  const getContractTable = async () => {
    if (!contractArticles?.length) {
      alert.error('Ovaj ugovor nema artikala!');
      return;
    }

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet('Sheet1');

    worksheet.columns = [
      {header: 'Opis predmeta nabavke', key: 'title'},
      {header: 'Bitne karakteristike predmeta nabavke', key: 'description'},
      {header: 'Jedinična cijena', key: 'price'},
    ];

    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell: any) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {argb: 'FFD3D3D3'}, // Light gray background
      };
      cell.border = {
        bottom: {style: 'thick', color: {argb: 'FF696969'}}, // Dark grey border-bottom
      };
    });

    contractArticles.forEach(item => {
      worksheet.addRow({title: item.title, description: item.description, price: ''});
    });

    worksheet.eachRow({includeEmpty: true}, function (row: any) {
      row.eachCell({includeEmpty: true}, function (cell: any, colNumber: any) {
        if (colNumber > 2) {
          // Assuming you want to lock the first two columns
          cell.protection = {
            locked: false,
          };
        }
      });
    });

    worksheet.columns.forEach(function (column: any) {
      let maxLength = 0;
      column['eachCell']?.({includeEmpty: true}, function (cell: any) {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength;
    });

    workbook.xlsx.writeBuffer().then((buffer: any) => {
      const blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      const url = URL.createObjectURL(blob);
      download(url, staticFileNameMap[type]);
    });
  };

  const buttonLoader = uploadLoading || loading;

  return (
    <CustomModal
      open={open}
      onClose={handleClose}
      title="UVEZI TABELU"
      width={680}
      customButtonsControls={
        <CustomFooter>
          <FooterText>
            <TemplateDownloadButton onClick={downloadTemplate}>Ovdje</TemplateDownloadButton>{' '}
            <span>možete da preuzmete tabelu za unos artikala.</span>
          </FooterText>

          <ModalButtons>
            <Button onClick={handleClose} content="Otkaži" />
            <Button
              onClick={() => {
                if (isContractArticles) {
                  handleSubmitContractArticles();
                } else {
                  handleSubmitPlanArticles();
                }
              }}
              content="Sačuvaj"
              variant="primary"
              isLoading={buttonLoader}
            />
          </ModalButtons>
        </CustomFooter>
      }
      content={
        <div>
          <FileUpload
            icon={null}
            files={files}
            variant="secondary"
            onUpload={handleUpload}
            note={<Typography variant="bodySmall" content="Ugovor" />}
            buttonText="Učitaj"
            error={error}
            accept=".xlsx, .xls"
          />
        </div>
      }
    />
  );
};

export default ImportArticlesModal;
