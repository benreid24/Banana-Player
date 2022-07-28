import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 98%;
  min-height: 100px;
  max-height: 20%;
  align-self: bottom;
  display: flex;
  flex-direction: row;
  border: 2px solid black;
  margin-left: auto;
  margin-right: auto;
`;

export const Controls: React.FC = () =>{
  return (
    <Container>
      Controls here
    </Container>
  );
};
