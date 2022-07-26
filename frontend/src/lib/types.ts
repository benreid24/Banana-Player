//////////////////  Config Types   //////////////////

export type OutputOption = {
  name: string;
  identifier: string;
};

export type OutputOptions = {
  localDevices: OutputOption[];
  renderers: OutputOption[];
};

export type PlayerConfig = {
  output?: OutputOption;
};

////////////////// Playback Types  //////////////////

export type TrackInfo = {
  title: string;
  artist: string;
  album: string;
  duration: number;
};

export type PlayingTrackInfo = {
  playingUserPlaylist: boolean;
  index: number;
  playHead: number;
  thumbnail?: Blob;
};

export type Playlist = {
  name: string;
  tracks: TrackInfo[];
  index: number;
};

export type PlayerState = {
  initialPlaylistChosen: boolean;
  playingPath: string[];
  mainPlaylist: Playlist;
  userQueue: Playlist;
  playingNow: PlayingTrackInfo;
  volume: number;
  paused: boolean;
};

export type PlayerStateUpdate = {
  userQueue: Playlist;
  nowPlaying: PlayingTrackInfo;
  volume: number;
  paused: boolean;
};

////////////////// Browse Types  //////////////////

export type FolderListing = {
  path: string[];
  name: string;
  childFolders: string[];
  tracks: TrackInfo[];
};
