import React from 'react';
import {useNavigate} from 'react-router-dom';

import {TitleBar} from 'components/TitleBar';
import {LoadingState} from 'components/LoadingState';
import {useConfigContext} from 'lib/contexts/ConfigContext';

export const Router: React.FC = () => {
  const {username, playerConfig} = useConfigContext();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!username || (playerConfig && !playerConfig.output)) {
      navigate('/setup', {replace: true});
    }
    if (username && playerConfig && playerConfig.output) {
      navigate('/player', {replace: true});
    }
  }, [playerConfig, navigate, username]);

  return (
    <>
      <TitleBar />
      <LoadingState/>
    </>
  )
};
