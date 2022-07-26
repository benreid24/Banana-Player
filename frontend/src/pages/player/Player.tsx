import React from 'react';
import {Navigate} from 'react-router-dom';

import {useConfigContext} from 'lib/contexts/ConfigContext';
import {TitleBar} from 'components/TitleBar';
import {LoadingState} from 'components/LoadingState';
import {usePlayerContext} from 'lib/contexts/PlayerContext';

export const Player: React.FC = () => {
  const {playerState} = usePlayerContext();
  const {username, playerConfig} = useConfigContext();

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

  return (
    <>
      <p>player here</p>
    </>
  );
};
