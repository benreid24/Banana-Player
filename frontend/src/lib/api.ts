import {FolderListing, OutputOptions, PlayerConfig, PlayerState, TrackInfo} from './types';
import {LiveConnection} from './live_connection';

let connection: LiveConnection | null = null;

const dummy = true;
let dummyConfig: PlayerConfig | null = null;
const dummyTracks: TrackInfo[] = [
  {
    title: 'Local song 1',
    artist: 'Glitch Mob',
    album: 'Drink the Sea',
    duration: 530
  },
  {
    title: 'Local song 2',
    artist: 'Glitch Mob',
    album: 'Drink the Sea',
    duration: 300
  },
  {
    title: 'Local song 3',
    artist: 'Glitch Mob',
    album: 'Drink the Sea',
    duration: 600
  }
];

export const registerConnection = (conn: LiveConnection) => {
  connection = conn;
};

export const listOutputOptions = async (): Promise<OutputOptions> => {
  if (dummy) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      localDevices: [
        {
          name: 'Speakers',
          identifier: 'speaker1'
        },
        {
          name: 'Monitor',
          identifier: 'monitor1'
        }
      ],
      renderers: [
        {
          name: 'Mega Dank Zone',
          identifier: 'mdz'
        },
        {
          name: 'Smart TV',
          identifier: 'tv1'
        }
      ]
    };
  }

  const res = await connection!.sendRequest({}, 'list_outputs');
  return res as OutputOptions;
};

export const setPlayerConfig = async (config: PlayerConfig): Promise<void> => {
  if (dummy) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    dummyConfig = config;
    return;
  }

  await connection!.sendRequest(config, 'set_output');
};

export const getPlayerConfig = async (): Promise<PlayerConfig> => {
  if (dummy) {
    return dummyConfig ? dummyConfig : {};
  }

  const res = await connection!.sendRequest({}, 'get_config');
  return res as PlayerConfig;
};

export const getPlayerState = async(): Promise<PlayerState> => {
  if (dummy) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      initialPlaylistChosen: false,
      playingPath: [],
      mainPlaylist: {
        name: 'Ultimate Peoplemon 3 Playlist',
        tracks: dummyTracks,
        index: 1,
      },
      userQueue: {
        name: 'User Queue',
        tracks: [
          {
            title: 'Ram Ranch',
            artist: 'Grant',
            album: 'Ram Ranch',
            duration: 10000
          },
          {
            title: 'Native Patties',
            artist: 'Unknown',
            album: 'Unknown',
            duration: 200
          }
        ],
        index: 0,
      },
      playingNow: {
        playingUserPlaylist: false,
        index: 1,
        playHead: 120,
      },
      volume: 100,
      paused: false
    }
  }

  const res = await connection!.sendRequest({}, 'get_player_state');
  return res as PlayerState;
};

export const listFolder = async (path: string[]): Promise<FolderListing> => {
  if (dummy) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      path: path,
      name: path[path.length - 1],
      childFolders: [
        'Folder 1',
        'Folder 2',
        'Folder 3',
        'Folder 4',
        'Really Long Folder Name Wow Crazy'
      ],
      tracks: dummyTracks
    };
  }

  const res = await connection!.sendRequest({
    path: path
  }, 'list_folder');
  return res as FolderListing;
};

export const playFolder = async (path: string[]): Promise<void> => {
  if (dummy) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    // TODO - set dummy player state to playing
    return;
  }

  await connection!.sendRequest({path: path}, 'play_folder');
};
