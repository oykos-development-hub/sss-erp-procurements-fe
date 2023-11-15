import {Button, FileUpload, Modal, Typography} from 'client-library';
import {useState} from 'react';
import useAppContext from '../../context/useAppContext';
import {REQUEST_STATUSES} from '../../services/constants';
import useProcurementArticleInsert from '../../services/graphql/procurementArticles/hooks/useProcurementArticleInsert';
import uploadArticlesXls from '../../services/uploadArticlesXls';
import {PublicProcurementArticleParams} from '../../types/graphql/publicProcurementArticlesTypes';
import {CustomFooter, FooterText, ModalButtons} from './styles';

type ImportArticlesModalProps = {
  onClose: () => void;
  refetch: () => void;
  open: boolean;
  procurementId: number;
};

const ImportArticlesModal = ({onClose, open, procurementId, refetch}: ImportArticlesModalProps) => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [articles, setArticles] = useState<PublicProcurementArticleParams[]>([]);
  const [showError, setShowError] = useState(false);

  const {alert} = useAppContext();
  const {mutate: addArticle, loading} = useProcurementArticleInsert();

  const handleUpload = async (files: FileList) => {
    setFiles(files);
    setShowError(false);

    if (files.length && procurementId) {
      const response = await uploadArticlesXls(files[0], procurementId);
      if (response.status === REQUEST_STATUSES.success) {
        setArticles(response.data);
      } else {
        alert.error('Došlo je do greške prilikom učitavanja fajla!');
      }
    }
  };

  const handleSubmit = async () => {
    if (articles.length) {
      await addArticle(articles, () => {
        alert.success('Artikli uspješno uvezeni');
        refetch();
        handleClose();
      });
    } else {
      setShowError(true);
    }
  };

  const handleClose = () => {
    setFiles(null);
    setShowError(false);
    onClose();
  };

  const getEnvUrl = () => {
    if (window.location.hostname === 'localhost') {
      return 'http://localhost:3002/excel-table.xlsx';
    } else {
      return 'https://sss-erp-procurements-fe.oykos.me/excel-table.xlsx';
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="UVEZI TABELU"
      customButtonsControls={
        <CustomFooter>
          <FooterText>
            <a href={getEnvUrl()} download="tabela-za-artikle.xlsx" rel="noreferrer">
              Ovdje
            </a>{' '}
            <span>možete da preuzmete tabelu za popunjavanje artikala.</span>
          </FooterText>

          <ModalButtons>
            <Button onClick={handleClose} content="Otkaži" />
            <Button onClick={handleSubmit} content="Sačuvaj" variant="primary" isLoading={loading} />
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
            error={showError ? 'Morate učitati fajl' : undefined}
            accept=".xlsx, .xls"
          />
        </div>
      }
    />
  );
};

export default ImportArticlesModal;
