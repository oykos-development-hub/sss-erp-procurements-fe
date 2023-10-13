import styled from 'styled-components';

export const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  > div {
    width: 250px;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
`;
