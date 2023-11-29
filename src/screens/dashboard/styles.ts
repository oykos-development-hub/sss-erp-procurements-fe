import styled, {css} from 'styled-components';
import {Theme, Typography, ChevronDownIcon, Table} from 'client-library';

export const Container = styled.div`
  font-family: 'Source Sans Pro', sans-serif;
  background-color: #f8f8f8;
  padding: 25px 30px;
  height: calc(100vh - 157px);
  overflow-y: auto;
  box-sizing: border-box;
  display: grid;
  grid-template-rows: 1fr 4fr 2fr;

  ul {
    margin: 0;
    padding: 0;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-rows: auto 2fr;
`;

export const Title = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 30px 0 30px;
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  > div {
    flex-grow: 1;
  }
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${Theme?.palette?.white};
  border-radius: 8px;
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.1);
  margin-top: 20px;
`;

export const CardContent = styled.div`
  padding: 0 30px;
`;

export const CardTitle = styled(Typography)`
  font-weight: 600;
`;

export const Icon = styled(ChevronDownIcon)(({isOpen}: {isOpen: boolean}) => {
  return css`
    stroke: ${Theme.palette.gray400};
    margin-top: 6px;
    cursor: pointer;
    path {
      stroke-width: 1;
      transform-origin: center;
      transform: ${isOpen ? 'rotate(180deg)' : 'rotate(0)'};
      transition: transform 0.2s ease-in;
    }
  `;
});

export const YearsFilter = styled.div`
  display: flex;
  gap: 5px;
`;

export const PlanInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 20px 45px 20px 0;
  div {
    h5 {
      font-weight: 700;
      margin-bottom: 5px;
    }
    p {
      color: ${Theme.palette.gray400};
    }
  }
`;

export const FooterButton = styled.div<{variant: string}>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 17px;
  background-color: ${({variant}) => (variant === 'primary' ? Theme.palette.primary200 : Theme.palette.secondary700)};
  border-radius: 0px 0px var(--8, 8px) var(--8, 8px);
  cursor: pointer;
  p {
    color: ${({variant}) => (variant === 'primary' ? Theme.palette.gray900 : Theme.palette.white)};
    font-weight: 600;
  }
`;
export const ContractStatus = styled.div`
  display: flex;
  align-items: center;
`;

export const Status = styled.div<{color: string}>`
  width: 10px;
  height: 10px;
  margin-right: 10px;
  border-radius: 50%;
  background-color: ${({color}) => color};
`;
export const ContractsTable = styled(Table)`
  margin: 25px 0;
  > table > tbody > tr {
    border-bottom: none !important;
  }
`;
export const Links = styled.div`
  margin-top: 25px;
  padding-bottom: 10px;
  span {
    cursor: pointer;
    margin-bottom: 10px;
  }
`;
