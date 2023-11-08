import {Typography, Theme} from 'client-library';
import {FileItem} from '../../types/graphql/procurementContractsTypes';
import {FileList as List, FileItem as File, Controls, CloseIcon, SmallButton} from './styles';
import useAppContext from '../../context/useAppContext';

type FileListProps = {
  files: FileItem[];
  onDelete: (id: number) => void;
};

const FileList = ({files}: FileListProps) => {
  const {
    fileService: {downloadFile},
    alert,
  } = useAppContext();

  const handleDownload = async (file: FileItem) => {
    await downloadFile(
      file.id,
      () => {
        alert.success(`Fajl ${file.name} uspješno preuzet`);
      },
      () => {
        alert.error('Došlo je do greške prilikom preuzimanja fajla');
      },
    );
  };

  const handleDelete = (file: FileItem) => {
    console.log('delete');
  };

  return (
    <List>
      {files &&
        files.map((file: FileItem) => (
          <File key={file.id}>
            <Typography content={file.name} />
            <Controls>
              <SmallButton content="Preuzmi" onClick={() => handleDownload(file)} />
              <SmallButton content="Obriši" onClick={() => handleDelete(file)} />
              {/* <SmallButton content="Otvori" onClick={() => handleView(file)} /> */}
              <CloseIcon stroke={Theme.palette.gray700} />
            </Controls>
          </File>
        ))}
    </List>
  );
};

export default FileList;
