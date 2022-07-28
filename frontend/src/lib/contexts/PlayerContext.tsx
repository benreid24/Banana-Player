import React from 'react';

import {PlayerState, PlayerStateUpdate} from 'lib/types';
import {LiveConnection} from 'lib/live_connection';
import {getPlayerState, registerConnection} from 'lib/api';

type PlayerContextProviderProps = {
  children: any[];
};

export type PlayerContextValue = {
  playerState: PlayerState | null;
  refreshState: () => Promise<PlayerState>;
};

export const PlayerContext = React.createContext<PlayerContextValue | null>(null);

export const PlayerContextProvider: React.FC<PlayerContextProviderProps> = ({children}) => {
  const [playerState, setPlayerState] = React.useState<PlayerState | null>(null);

  const refreshState = React.useCallback(async () => {
    setPlayerState(null);
    const ns = await getPlayerState();
    setPlayerState(ns);
    return ns;
  }, [setPlayerState]);

  const handleRefresh = React.useCallback((refresh: PlayerState) => {
    setPlayerState(refresh);
  }, [setPlayerState]);

  const handleUpdate = React.useCallback((update: PlayerStateUpdate) => {
    setPlayerState((state: PlayerState | null) => {
      if (!state) {
        console.log("Received player state update before initial state set");
        return null;
      }

      return {
        ...state,
        userQueue: update.userQueue,
        volume: update.volume,
        paused: update.paused,
        playingNow: update.nowPlaying,
        mainPlaylist: {
          ...state.mainPlaylist,
          index: !update.nowPlaying.playingUserPlaylist ? update.nowPlaying.index : state.mainPlaylist.index,
        }
      };
    });
  }, [setPlayerState]);

  const [apiConnection] = React.useState<LiveConnection>(LiveConnection.getOrCreate(handleUpdate, handleRefresh));
  registerConnection(apiConnection);

  React.useEffect(() => {
    getPlayerState().then(state => setPlayerState(state));
  }, []);

  const contextValue = React.useMemo<PlayerContextValue>(() => ({
    playerState,
    refreshState
  }),[
    playerState,
    refreshState
  ]);

  return <PlayerContext.Provider value={contextValue}>{children}</PlayerContext.Provider>
};

export const usePlayerContext = (): PlayerContextValue => {
  const ctx = React.useContext(PlayerContext);
  if (!ctx) {
    throw new Error('usePlayerContext() may only be called from within a PlayerContextProvider');
  }
  return ctx;
};
