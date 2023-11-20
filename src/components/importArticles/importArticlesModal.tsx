import {Button, FileUpload, Typography} from 'client-library';
import {useState} from 'react';
import useAppContext from '../../context/useAppContext';
import {REQUEST_STATUSES} from '../../services/constants';
import useProcurementArticleInsert from '../../services/graphql/procurementArticles/hooks/useProcurementArticleInsert';
import uploadArticlesXls from '../../services/uploadArticlesXls';
import {PublicProcurementArticleParams} from '../../types/graphql/publicProcurementArticlesTypes';
import {CustomFooter, CustomModal, FooterText, ModalButtons, TemplateDownloadButton} from './styles';

const staticFileNameMap = {
  article_table: 'tabela_za_dodavanje_artikala.xlsx',
  contract_articles_table: 'tabela_za_artikl_ugovora.xlsx',
};

const missingFileError = 'Morate učitati fajl!';
const emptyTableError = 'Tabela je prazna!';

type ImportArticlesModalProps = {
  onClose: () => void;
  refetch: () => void;
  open: boolean;
  procurementId: number;
  type: keyof typeof staticFileNameMap;
};

const ImportArticlesModal = ({onClose, open, procurementId, refetch, type}: ImportArticlesModalProps) => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [articles, setArticles] = useState<PublicProcurementArticleParams[]>([]);
  const [error, setError] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);

  const {
    alert,
    fileService: {downloadStaticFile},
    constants: {staticFileNameMap},
  } = useAppContext();
  const {mutate: addArticle, loading} = useProcurementArticleInsert();

  const handleUpload = async (files: FileList) => {
    setUploadLoading(true);
    setFiles(files);
    setError('');

    if (files.length && procurementId) {
      const response = await uploadArticlesXls(files[0], procurementId);
      if (response.status === REQUEST_STATUSES.success) {
        if (response.data?.length) {
          setArticles(response.data);
        } else {
          setError(emptyTableError);
        }
      } else {
        alert.error('Došlo je do greške prilikom učitavanja fajla!');
      }
    } else {
      // if no files present, it means the user deleted the uploaded file
      setArticles([]);
    }

    setUploadLoading(false);
  };

  const handleSubmit = async () => {
    if (articles && !articles.length && !error) {
      setError(missingFileError);
      return;
    }

    if (error) return;

    await addArticle(articles, () => {
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
    await downloadStaticFile(staticFileNameMap[type], {
      onSuccess: () => {
        alert.success('Uspješno preuzet fajl');
      },
      onError: () => {
        alert.error('Došlo je do greške prilikom preuzimanja fajla');
      },
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
            <span>možete da preuzmete tabelu za popunjavanje artikala.</span>
          </FooterText>

          <ModalButtons>
            <Button onClick={handleClose} content="Otkaži" />
            <Button onClick={handleSubmit} content="Sačuvaj" variant="primary" isLoading={buttonLoader} />
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
            multiple={true}
            error={error}
            accept=".xlsx, .xls"
          />
        </div>
      }
    />
  );
};

export default ImportArticlesModal;
