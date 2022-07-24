//////////////////  Config Types   //////////////////

export enum OutputType {
  AudioDevice = 0,
  MediaRenderer = 1
};

export type OutputOption = {
  outputType: OutputType;
  name: string;
}

////////////////// Playback Types  //////////////////

export type TrackInfo = {
  title: string;
  artist: string;
  album: string;
  duration: number;
};

export type PlayingTrackInfo = TrackInfo & {
  playHead: number;
  thumbnail: Blob;
};

export type Playlist = {
  name: string;
  tracks: TrackInfo[];
  index: number;
  nowPlaying: PlayingTrackInfo;
};

export type PlayInfo = {
  mainPlaylist: Playlist;
  userQueue: Playlist;
  playingUserList: boolean;
  volume: number;
};

export type PlayInfoUpdate = {
  userQueue: Playlist;
  playingUserList: boolean;
  playIndex: number;
  playHead: number;
  volume: number;
}
