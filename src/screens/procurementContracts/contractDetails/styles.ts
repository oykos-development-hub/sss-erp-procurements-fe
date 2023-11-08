import styled from 'styled-components';
import {Theme, Typography} from 'client-library';

export const Price = styled(Typography)`
  padding: 14px 0 0 12px;
`;

export const Column = styled.div`
  width: 320px;
`;

export const FormFooter = styled.div`
  width: 100%;
  height: 91px;
  border-top: 1px solid ${Theme.palette.gray500};
  background-color: ${Theme.palette.gray50};
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 14px;
  box-sizing: border-box;
  margin-top: 20px;
`;

export const FormControls = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const Plan = styled.div`
  margin-top: 35px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: ${Theme.palette.gray50};
  padding: 10px;
`;

export const FileUploadWrapper = styled.div`
  max-width: 600px;
  align-items: center;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;

  > div > div {
    display: block;
    width: 100%;
    & div > p > p {
      font-weight: 600;
      line-height: 20px;
    }
  }
`;

export const ErrorText = styled.span`
  color: ${Theme.palette.error500};
  font-size: 12px;
`;
