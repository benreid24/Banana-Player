import React from 'react';

import {PlayerConfig} from 'lib/types';
import {getPlayerConfig, setPlayerConfig as setRemotePlayerConfig} from 'lib/api';

const forceNameEntry = true;

type ConfigContextProviderProps = {
  children: any[];
}

export type ConfigContextValue = {
  playerConfig: PlayerConfig | null;
  username: string | null;
  setUsername: (name: string) => void;
  setPlayerConfig: (config: PlayerConfig) => void;
};

export const ConfigContext = React.createContext<ConfigContextValue | null>(null);

export const ConfigContextProvider: React.FC<ConfigContextProviderProps> = ({children}) => {
  const [username, setMemoryUsername] = React.useState<string | null>(!forceNameEntry ? localStorage.getItem('username') : null);
  const [playerConfig, setLocalPlayerConfig] = React.useState<PlayerConfig | null>(null);

  React.useEffect(() => {
    getPlayerConfig().then(config => setLocalPlayerConfig(config));
  }, []);

  const setUsername = React.useCallback((name: string) => {
    setMemoryUsername(name);
    localStorage.setItem('username', name);
  }, [setMemoryUsername]);

  const setPlayerConfig = React.useCallback((config: PlayerConfig) => {
    setRemotePlayerConfig(config).then(() => setLocalPlayerConfig(config));
  }, [setLocalPlayerConfig]);

  const contextValue = React.useMemo<ConfigContextValue>(
    () => ({
      playerConfig,
      username,
      setUsername,
      setPlayerConfig
    }),
    [
      playerConfig,
      username,
      setUsername,
      setPlayerConfig
    ]
  );

  return <ConfigContext.Provider value={contextValue}>{children}</ConfigContext.Provider>
};

export const useConfigContext = (): ConfigContextValue => {
  const ctx = React.useContext(ConfigContext);
  if (!ctx) {
    throw new Error('useConfigContext() may only be called from within a ConfigContextProvider');
  }
  return ctx;
};
