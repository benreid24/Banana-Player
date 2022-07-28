import React from 'react';
import styled from 'styled-components';
import {useNavigate} from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-left: auto;
  margin-right: auto;
  margin-top: 30px;
  max-width: 75%;
  min-width: 50%;
`;

const LeftSection = styled.div`
  display: flex;
  justify-content: left;
  width: 20%;
`;

const MiddleSection = styled.div`
  display: flex;
  justify-content: center;
  width: 60%;
  overflow-x: auto;
  overflow-y: hidden;
  margin-left: 16px;
  margin-right: 16px;
`;

const RightSection = styled.div`
  display: flex;
  justify-content: right;
  width: 20%;
`;

const FolderPathArea = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-grow: 1;
  align-items: center;
`;

const FolderPathButton = styled.div`
  background: #f28f94;
  border-radius: 4px;
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  cursor: pointer;
  user-select: none;
  border: 2px solid black;
  text-overflow: ellipsis;
  overflow: hidden;
  min-width: 80px;

  &:hover {
    background-color: #ffafb4;
  }

  &:active {
    background-color: #d26f54;
  }
`;

const FolderPathText = styled.p`
  font-size: 16pt;
  text-align: center;
  color: black;
  margin-left: 8px;
  margin-right: 8px;
  margin-top: 0;
  margin-bottom: 0;
  padding: 0;
`;

const FolderSlashText = styled.p`
  font-size: 32pt;
  text-align: center;
  color: black;
  margin-left: 8px;
  margin-right: 8px;
  margin-top: 0;
  margin-bottom: 0;
  padding: 0;
`;

const PlayButton = styled.div`
  border-radius: 7px;
  background-color: #10ee27;
  min-width: 80px;
  min-height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  transition: all 0.3s;
  cursor: pointer;
  user-select: none;
  border: 2px solid green;

  &:hover {
    background-color: #10ff67;
  }

  &:active {
    background-color: #00ae07;
  }
`;

const PlayText = styled.h2`
  margin: 0;
  padding: 0;
  font-size: 26pt;
`;

const BackToPlayerButton = styled.div`
  border-radius: 7px;
  background-color: #f2a5e7;
  min-width: 80px;
  min-height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  transition: all 0.3s;
  cursor: pointer;
  user-select: none;
  border: 2px solid green;

  &:hover {
    background-color: #ffc5f7;
  }

  &:active {
    background-color: #d285c7;
  }
`;

type FolderPathProps = {
  path: string[];
  onFolderClicked: (index: number) => void;
}

const FolderPath: React.FC<FolderPathProps> = ({path, onFolderClicked}) => {
  console.log(path);

  if (path.length === 0) {
    return <FolderPathArea/>
  }

  const renderPathButton = (folder: string, index: number) => {
    return (
      <FolderPathButton key={folder} onClick={() => onFolderClicked(index)}>
        <FolderPathText>{folder}</FolderPathText>
      </FolderPathButton>
    );
  };

  const segments = path.map((folder, i) => (
    <>
      <FolderSlashText>/</FolderSlashText>
      {renderPathButton(folder, i)}
    </>
  ));

  return (
    <FolderPathArea>
      {renderPathButton('<Root>', -1)}
      {segments}
    </FolderPathArea>
  )
};

export type ControlRowProps = {
  path: string[];
  playerAvailable: boolean;
  onFolderClicked: (index: number) => void;
  onPlayClicked: () => void;
};

export const ControlRow: React.FC<ControlRowProps> = ({path, playerAvailable, onFolderClicked, onPlayClicked}) => {
  const navigate = useNavigate();

  return (
    <Container>
      <LeftSection>
        <PlayButton onClick={onPlayClicked}>
          <PlayText>Play Folder</PlayText>
        </PlayButton>
      </LeftSection>
      <MiddleSection>
        <FolderPath path={path} onFolderClicked={onFolderClicked} />
      </MiddleSection>
      <RightSection>
        {playerAvailable && (
          <BackToPlayerButton onClick={() => navigate('/player')}>
            <PlayText>Now Playing</PlayText>
          </BackToPlayerButton>
        )}
      </RightSection>
    </Container>
  )
};
