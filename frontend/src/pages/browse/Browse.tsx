import React from 'react';
import {Navigate, useNavigate} from 'react-router-dom';
import styled from 'styled-components';

import {useConfigContext} from 'lib/contexts/ConfigContext';
import {usePlayerContext} from 'lib/contexts/PlayerContext';
import {TitleBar} from 'components/TitleBar';
import {LoadingState} from 'components/LoadingState';
import {Page} from 'components/Page';
import {FolderListing, TrackInfo} from 'lib/types';
import {listFolder, playFolder} from 'lib/api';
import {FolderSelector} from './FolderSelector';
import {TrackListing} from './TrackListing';
import {ControlRow} from './ControlRow';
import path from 'path';

const TracksLabel = styled.h2`
  font-size: 28pt;
  text-align: center;
  padding-bottom: 0;
  margin-bottom: 0;
`;

export const Browse: React.FC = () => {
  const navigate = useNavigate();
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

  const startListFolder = (newPath: string[]) => {
    console.log(`listing folder: ${newPath}`)
    setFolderListing(null);
    listFolder(newPath).then(listing => setFolderListing(listing));
  };

  const onFolderClicked = (folder: string) => {
    startListFolder([...folderListing.path, folder]);
  };

  const onPathClicked = (index: number) => {
    startListFolder(index >= 0 ? folderListing.path.slice(0, index + 1) : []);
  };

  const onPlayClicked = () => {
    setFolderListing(null);
    playFolder(folderListing.path).then(() => navigate('/player'));
  };

  const track: TrackInfo = {
    title: 'Ram Ranch',
    artist: 'Grant McDonnough',
    album: 'Album of Dicks',
    duration: 920
  };

  return (
    <Page>
      <TitleBar/>
      <ControlRow
        path={folderListing.path}
        playerAvailable={playerState ? playerState.initialPlaylistChosen : false}
        onFolderClicked={onPathClicked}
        onPlayClicked={onPlayClicked}
      />
      <TracksLabel>Folders</TracksLabel>
      <FolderSelector folders={folderListing.childFolders} onFolderClicked={onFolderClicked} />
      <TracksLabel>Tracks</TracksLabel>
      <TrackListing tracks={folderListing.tracks} />
    </Page>
  );
};
