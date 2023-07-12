import styled from 'styled-components';

export const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;

  input {
    width: 410px;
  }
`;

export const LabelWrapper = styled.div`
  display: inline-flex;
  width: 100%;
  gap: 6px;
`;
