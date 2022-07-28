import React from 'react';
import styled from 'styled-components';

const FolderTileBackground = styled.div`
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.45);
  border: 2px solid black;
  margin-left: 30px;
  margin-right: 30px;
  width: 30%;
  min-width: 30%;
  max-width: 30%;
  text-overflow: ellipsis;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  cursor: pointer;
  user-select: none;
  transition: all 0.7s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.75);
  }

  &:active {
    background-color: rgba(0, 0, 0, 0.35);
  }
`;

const FolderTitle = styled.h2`
  font-size: 26pt;
  text-align: center;
  color: #fefece;
`;

const FolderRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 95%;
  margin-bottom: 30px;
  height: 14vh;
  margin-right: auto;
  margin-left: auto;
  align-items: center;
  justify-content: center;
`;

const FolderRowArea = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 75%;
  min-width: 50%;
  max-width: 95%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 30px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const FolderTile: React.FC<{title: string, onClicked: (title: string) => void;}> = ({title, onClicked}) => {
  return (
    <FolderTileBackground onClick={() => onClicked(title)}>
      <FolderTitle>{title}</FolderTitle>
    </FolderTileBackground>
  );
};

export type FolderListingProps = {
  folders: string[];
  onFolderClicked: (folder: string) => void;
};

export const FolderSelector: React.FC<FolderListingProps> = ({folders, onFolderClicked}) => {
  const renderRow = (folders: string[]) => {
    const tiles = folders.map(folder => <FolderTile key={folder} title={folder} onClicked={onFolderClicked}/>);
    return (
      <FolderRow key={folders[0]}>
        {tiles}
      </FolderRow>
    );
  };

  let renderedFolders: React.ReactElement[] = [];
  for (let i = 0; i < folders.length; i += 3) {
    renderedFolders.push(renderRow(folders.slice(i, i+3)));
  }

  return (
    <FolderRowArea>
      {renderedFolders}
    </FolderRowArea>
  );
};
