import styled from 'styled-components';
import {Theme, Typography} from 'client-library';

export const LandingPageTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  background-color: ${Theme?.palette?.white};
  border-radius: 8px;
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.1);
`;

export const Container = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  width: 100%;
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #dfd7d6ab;
  height: 40%;
`;

export const Title = styled(Typography)`
  font-weight: 600;
  color: ${Theme?.palette?.gray600};
  padding: '20px';
`;

export const ContentBox = styled.div`
  height: 160px;
  width: 100%;
  background-color: ${Theme?.palette?.white};
  padding: 0px, 0px, 20px, 0px;

  :hover ${TitleWrapper} {
    background-color: ${Theme?.palette?.primary500};
  }

  :hover ${Title} {
    color: ${Theme?.palette?.white};
  }

  &:not(:first-child) {
    margin-left: 21px;
  }
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60%;
`;
