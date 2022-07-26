import React from 'react';
import styled from 'styled-components';

import {useConfigContext} from 'lib/contexts/ConfigContext';
import {Logo} from './Logo';

const Container = styled.div`
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
`;

const TextArea = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
`;

const Header = styled.h1`
  font-size: 36pt;
  color: #f0ed3a;
  margin: 0;
`;

const Name = styled.h2`
  text-align: center;
  padding: 0;
  margin: 0;
`;

export const TitleBar: React.FC = () => {
  const {username} = useConfigContext();

  return (
    <Container>
      <TextArea>
        <Header>Banana Player</Header>
        {username ? <Name>{username}</Name> : null}
      </TextArea>
      <Logo/>
    </Container>
  )
};
