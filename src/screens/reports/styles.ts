import styled from 'styled-components';
import {Typography, Theme, Divider} from 'client-library';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  box-shadow: 0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06);
  border-radius: 8px;
  background-color: ${Theme?.palette?.white};
  padding: 20px;

  & > span {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
  }
`;

export const CustomDivider = styled(Divider)`
  height: 1px;
  width: 100%;
  color: ${Theme?.palette?.gray800};
`;

export const MainTitle = styled(Typography)`
  margin-bottom: 10px;
  font-weight: 600;
  text-transform: uppercase;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  row-gap: 8px;
  column-gap: 10px;
  margin-top: 33px;
  margin-bottom: 33px;
`;

export const Filters = styled.div`
  display: flex;
  gap: 8px;
  flex-grow: 1;
  margin-bottom: 30px;
`;

export const Column = styled.div`
  width: 320px;
`;
