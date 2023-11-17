import styled from 'styled-components';
import {Theme, Modal} from 'client-library';

export const CustomModal = styled(Modal)`
  & > div:nth-child(2) p {
    display: none;
  }
`;

export const CustomFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
  width: 100%;
`;

export const ModalButtons = styled.div`
  display: flex;
  gap: 4px;
`;

export const FooterText = styled.span`
  font-size: 16px;
  font-family: ${Theme.fontFamily.two};
`;

export const TemplateDownloadButton = styled.span`
  color: #017698;
  text-decoration: underline;
  cursor: pointer;
`;
