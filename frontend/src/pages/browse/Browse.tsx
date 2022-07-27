import React from 'react';
import {Navigate} from 'react-router-dom';

import {useConfigContext} from 'lib/contexts/ConfigContext';
import {usePlayerContext} from 'lib/contexts/PlayerContext';
import {TitleBar} from 'components/TitleBar';
import {LoadingState} from 'components/LoadingState';
import {Page} from 'components/Page';
import {FolderListing} from 'lib/types';
import {listFolder} from 'lib/api';
import styled from 'styled-components';

const ControlRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-left: auto;
  margin-right: auto;
  max-width: 75%;
`;

const FolderTileBackground = styled.div`
  border-radius: 8px;
  background-color: #eff28f;
  border: 2px solid black;
  margin-left: 30px;
  margin-right: 30px;
`;

const FolderTitle = styled.h2`
  font-size: 32pt;
  text-align: left;
  color: #333333;
  margin-left: 12px;
  margin-top: 8px;
`;

const FolderRow = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 75%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 30px;
`;

const FolderRowArea = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 75%;
  width: 100%;
  overflow-y: auto;
`;

const FolderPathArea = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-grow: 1;
`;

const FolderPathButton = styled.div`
  background: #f28f94;
  border: 1px solid red;
  border-radius: 4px;
`;

const FolderPathText = styled.p`
  font-size: 16pt;
  text-align: center;
  color: black;
  margin-left: 8px;
  margin-right: 8px;
`;

const FolderTile: React.FC<{title: string}> = ({title}) => {
  return (
    <FolderTileBackground>
      <FolderTitle>{title}</FolderTitle>
    </FolderTileBackground>
  );
};

const FolderPath: React.FC<{path: string[]}> = ({path}) => {
  if (path.length === 0) {
    return <FolderPathArea/>
  }

  const renderPathButton = (folder: string) => {
    return (
      <FolderPathButton key={folder}>
        <FolderPathText>{folder}</FolderPathText>
      </FolderPathButton>
    );
  };

  const segments = path.slice(1).map(folder => (
    <>
      <FolderPathText>/</FolderPathText>
      {renderPathButton(folder)}
    </>
  ));

  return (
    <FolderPathArea>
      {renderPathButton(path[0])}
      {segments}
    </FolderPathArea>
  )
};

export const Browse: React.FC = () => {
  const {playerState} = usePlayerContext();
  const {username, playerConfig} = useConfigContext();

  const [folderListing, setFolderListing] = React.useState<FolderListing | null>(null);
  const [initialListing, setInitialListing] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (playerState && !folderListing && !initialListing) {
      setInitialListing(true);
      listFolder(playerState.playingPath).then(listing => setFolderListing(listing));
    }
  }, [setFolderListing, playerState]);

  if (!playerConfig) {
    return (
      <>
        <TitleBar/>
        <LoadingState/>
      </>
    );
  }

  if (!username || !playerConfig.output) {
    return <Navigate to='/setup' replace />
  }

  if (!folderListing) {
    return (
      <>
        <TitleBar/>
        <LoadingState/>
      </>
    );
  }

  const renderRow = (folders: string[]) => {
    const tiles = folders.map(folder => <FolderTile key={folder} title={folder}/>);
    return (
      <FolderRow key={folders[0]}>
        {tiles}
      </FolderRow>
    );
  };

  let folders: React.ReactElement[] = [];
  for (let i = 0; i < folderListing.childFolders.length; i += 3) {
    folders.push(renderRow(folderListing.childFolders.slice(i, i+3)));
  }

  return (
    <Page>
      <TitleBar/>
      <FolderRowArea>
        {folders}
      </FolderRowArea>
    </Page>
  );
};
