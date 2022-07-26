import React from 'react';
import {Navigate} from 'react-router-dom';

import {useConfigContext} from 'lib/contexts/ConfigContext';
import {usePlayerContext} from 'lib/contexts/PlayerContext';
import {TitleBar} from 'components/TitleBar';
import {LoadingState} from 'components/LoadingState';
import {Page} from 'components/Page';
import {FolderListing} from 'lib/types';
import {listFolder} from 'lib/api';

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

  return (
    <Page>
      <TitleBar/>
    </Page>
  );
};
