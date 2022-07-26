import React from 'react';
import {useNavigate} from 'react-router-dom';

import {useConfigContext} from 'lib/contexts/ConfigContext';

export const Player: React.FC = () => {
  const {username, playerConfig} = useConfigContext();
  const navigate = useNavigate();

  if (!username || (playerConfig && !playerConfig.output)) {
    navigate('/setup', {replace: true});
  }

  return (
    <>
      <p>player here</p>
    </>
  );
};
