import styled from 'styled-components';
import {Theme} from 'client-library';

export const CustomFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
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
