import styled from 'styled-components';
import {Button, XIcon, Theme} from 'client-library';

export const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const FileItem = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${Theme.palette.gray50};
  padding: 3px 6px;
  border-radius: 4px;
`;

export const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const SmallButton = styled(Button)`
  padding: 4px;

  & > div {
    font-size: 0.7rem;
  }
`;

export const CloseIcon = styled(XIcon)`
  width: 12px;
  cursor: pointer;
`;
