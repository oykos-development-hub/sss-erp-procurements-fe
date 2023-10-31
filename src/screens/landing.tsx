import React from 'react';
import {AnimationWrapper, ParentContainer, RedDiv, Title} from '../components/landingPage/styles';
import Animation from '../components/landingPage/animation';

const PROCUREMENTS: React.FC = () => {
  return (
    <ParentContainer>
      <RedDiv>
        <Title>
          <h1>JAVNE NABAVKE</h1>
        </Title>
      </RedDiv>
      <AnimationWrapper>
        <Animation />
      </AnimationWrapper>
    </ParentContainer>
  );
};

export default PROCUREMENTS;
