import React from 'react';
import {Navigate} from 'react-router-dom';
import styled from 'styled-components';

import {useConfigContext} from 'lib/contexts/ConfigContext';
import {TitleBar} from 'components/TitleBar';
import {LoadingState} from 'components/LoadingState';
import {usePlayerContext} from 'lib/contexts/PlayerContext';
import {Page} from 'components/Page';
import {TrackList} from './TrackList';
import {SongAdder} from './SongAdder';
import { Controls } from './Controls';

const TrackArea = styled.div`
  max-width: 90%;
  min-width: 800px;
`;

const PlaylistSwitcherContainer = styled.div`
  max-width: 90%;
  min-width: 75%;
  display: flex;
  flex-direction: row;
  margin-left: auto;
  margin-right: auto;
  align-items: center;
  justify-content: space-between;
  margin-top: 5px;
  margin-bottom: 10px;
`;

const LeftSide = styled.div`
  display: flex;
  justify-content: left;
  width: 50%;
`;

const RightSide = styled.div`
  display: flex;
  justify-content: right;
  width: 50%;
`;

const PlaylistButtonActive = styled.div`
  width: 35%;
  height: 4vh;
  border: 2px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  border-radius: 10px;
  margin-right: 16px;
`;

const PlaylistButtonInactive = styled.div`
  width: 35%;
  height: 4vh;
  border: 2px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  background-color: #fa23ec;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.3s;
  margin-right: 16px;

  &:hover {
    background-color: #ff63ff;
  }

  &:active {
    background-color: #ca03cc;
  }
`;

const PlaylistButtonText = styled.h2`
  padding: 0;
  margin: 0;
  font-size: 24pt;
`;

type PlaylistSwitcherProps = {
  onPlaylistSwitch: (mainOpen: boolean) => void;
  mainIsActive: boolean;
};

const PlaylistSwitcher: React.FC<PlaylistSwitcherProps> = ({onPlaylistSwitch, mainIsActive}) => {
  const MainButton = mainIsActive ? PlaylistButtonActive : PlaylistButtonInactive;
  const UserButton = mainIsActive ? PlaylistButtonInactive : PlaylistButtonActive;

  return (
    <PlaylistSwitcherContainer>
      <LeftSide>
        <MainButton onClick={() => !mainIsActive ? onPlaylistSwitch(true) : null}>
          <PlaylistButtonText>Playlist</PlaylistButtonText>
        </MainButton>
        <UserButton onClick={() => mainIsActive ? onPlaylistSwitch(false) : null}>
          <PlaylistButtonText>User Queue</PlaylistButtonText>
        </UserButton>
      </LeftSide>
      <RightSide>
        <SongAdder/>
      </RightSide>
    </PlaylistSwitcherContainer>
  )
}

export const Player: React.FC = () => {
  const {playerState} = usePlayerContext();
  const {username, playerConfig} = useConfigContext();

  const [showMainList, setShowMainList] = React.useState<boolean>(true);

  if (!playerConfig || !playerState) {
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
  if (!playerState.initialPlaylistChosen) {
    return <Navigate to='/browse' replace />
  }

  const onSongRemove = (index: number) => {
    // TODO
  };

  const onSongPlay = (index: number) => {
    //
  };

  const playlist = showMainList ? playerState.mainPlaylist : playerState.userQueue;

  return (
    <Page>
      <TitleBar />
      <PlaylistSwitcher onPlaylistSwitch={setShowMainList} mainIsActive={showMainList} />
      <TrackList
        tracks={playlist.tracks}
        nowPlaying={playerState.playingNow.playingUserPlaylist !== showMainList ? playlist.index : -1}
        onTrackPlay={(index: number) => onSongPlay(index)}
      />
      <Controls/>
    </Page>
  );
};
