import styled from 'styled-components';
import {Typography, Theme} from 'client-library';

export const Controls = styled.div`
  display: flex;
`;

export const ModalContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  > div {
    width: 50%;
  }
`;

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 15px;
`;

export const CheckboxLabel = styled(Typography)`
  margin-left: 5px;
`;

export const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 28px;
`;
