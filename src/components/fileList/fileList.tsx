import {Theme, Typography} from 'client-library';
import useAppContext from '../../context/useAppContext';
import {FileItem} from '../../types/graphql/procurementContractsTypes';
import {Controls, DeleteFileIcon, DownloadFileIcon, FileItem as File, FileIconButton, FileList as List} from './styles';

type FileListProps = {
  files: FileItem[];
  // Delete will be done in the component. It needs to happen after saving the contract,
  // because it is more important to delete it from the contract than it is from the server.
  // Once the contract is saved, it can be deleted from the server
  onDelete?: (id: number) => void;
};

const FileList = ({files, onDelete}: FileListProps) => {
  const {
    fileService: {downloadFile, deleteFile},
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

  return (
    <List>
      {files &&
        files.map((file: FileItem) => (
          <File key={file.id}>
            <Typography content={file.name} />
            <Controls>
              <FileIconButton onClick={() => handleDownload(file)}>
                <DownloadFileIcon stroke={Theme.palette.gray700} />
              </FileIconButton>
              {onDelete && (
                <FileIconButton>
                  <DeleteFileIcon stroke={Theme.palette.gray700} onClick={() => onDelete(file.id)} />
                </FileIconButton>
              )}
            </Controls>
          </File>
        ))}
    </List>
  );
};

export default FileList;
