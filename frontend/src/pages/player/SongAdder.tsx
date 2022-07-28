import React from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 10;
`;

const AddButton = styled.div`
  width: 35%;
  height: 4vh;
  border: 2px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  background-color: #12de35;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.3s;

  &:hover {
    background-color: #32ff65;
  }

  &:active {
    background-color: #02ae05;
  }
`;

const AddText = styled.h2`
  margin: 0;
  padding: 0;
  font-size: 26pt;
`;

export type SongAdderProps = {
  // anything?
};

export const SongAdder: React.FC<SongAdderProps> = () => {
  return (
    <AddButton>
      <AddText>Queue Song</AddText>
    </AddButton>
  )
};