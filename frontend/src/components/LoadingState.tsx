import React from 'react';
import styled from 'styled-components';

import Beans from 'assets/images/loading.gif';

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
`;

export const LoadingState: React.FC = () => {
  return (
    <Container>
      <img src={Beans} alt="Loading..." />
    </Container>
  );
};
