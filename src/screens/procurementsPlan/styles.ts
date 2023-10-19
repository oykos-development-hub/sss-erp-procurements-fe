import styled from 'styled-components';
import {Tabs, Theme, Typography, Datepicker, Input} from 'client-library';

export const StyledTabs = styled(Tabs)`
  border-width: 1px;
  white-space: nowrap;

  button {
    border-radius: 0.5em 0.5em 0 0;
  }
`;

export const TitleTabsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

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

export const DropdowWrapper = styled.div`
  width: 300px;
  margin: 22px 0;
`;

export const Totals = styled.div`
  margin: 40px 0px 20px 0px;
  display: flex;
`;

export const TotalValues = styled.div`
  margin: 30px 0;
  display: flex;
`;

export const StatusForm = styled.form`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  > div:first-child {
    width: 40%;
  }
`;
export const DateWrapper = styled.div`
  display: flex;
`;

export const DatePickerWrapper = styled(Datepicker)`
  padding-right: 10px;
  margin-top: -2px;
`;

export const MessageBox = styled.p`
  margin-top: 40px;
  color: ${Theme.palette.error700};
  border: 1px solid ${Theme.palette.gray100};
  background-color: white;
  padding: 20px;
  border-radius: 8px;
`;
