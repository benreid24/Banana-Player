import React from 'react';
import {Navigate} from 'react-router-dom';

import {useConfigContext} from 'lib/contexts/ConfigContext';
import {usePlayerContext} from 'lib/contexts/PlayerContext';
import {TitleBar} from 'components/TitleBar';
import {LoadingState} from 'components/LoadingState';

export const Browse: React.FC = () => {
  const {playerState} = usePlayerContext();
  const {username, playerConfig} = useConfigContext();

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

  return (
    <>
      Browse Page Here
    </>
  );
};
