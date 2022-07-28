import React from 'react';
import styled from 'styled-components';

import {TrackInfo} from 'lib/types';

const RowContainer = styled.div<{isEven: boolean; isPlaying: boolean;}>`
  width: calc(100% - 4px);
  border: 1px solid black;
  background-color: ${({isEven, isPlaying}) => {
    if (isPlaying) {
      return 'rgba(247, 247, 111, 0.9)';
    }
    return isEven ? 'rgba(135, 135, 126, 0.7)' : 'rgba(245, 245, 242, 0.7)';
  }};
  display: flex;
  flex-direction: row;
  height: 2vh;
  min-height: 35px;
  max-height: 50px;
  margin: 0;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    opacity: 60%;
  }
`;

const TitleBox = styled.div`
  display: flex;
  width: 34%;
  height: 100%;
  align-items: center;
  text-overflow: ellipsis;
`;

const TitleText = styled.h2<{isPlaying: boolean}>`
  font-size: 20pt;
  margin: 0;
  padding: 0;
  font-style: ${({isPlaying}) => isPlaying ? 'italic' : 'normal'};

  @keyframes dance {
    from {
      transform: skewX(-20deg);
    }

    to {
      transform: skewX(deg);
    }
  };

  ${({isPlaying}) => isPlaying ? 'animation-name: dance;' : ''}
  animation-duration: 0.6s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
`;

const TextBox = styled.div`
  display: flex;
  width: 28%;
  height: 100%;
  text-overflow: ellipsis;
  align-items: center;
  justify-content: left;
`;

const ArtistText = styled.h2`
  margin: 0;
  padding: 0;
  font-size: 18pt;
  text-color: rgb(30, 30, 30);
`;

const AlbumText = styled.h2`
  margin: 0;
  padding: 0;
  font-size: 18pt;
  font-style: italic;
  text-color: #202060;
`;

const TimeBox = styled.div`
  display: flex;
  width: 10%;
  height: 100%;
  text-overflow: ellipsis;
  align-items: center;
  justify-content: right;
`;

const TimeText = styled.h2`
  margin: 0;
  padding: 0;
  font-size: 18pt;
  text-color: #205050;
`;

const TrackTime: React.FC<{duration: number}> = ({duration}) => {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.round(duration) % 60;
  const timeText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  return (
    <TimeText>{timeText}</TimeText>
  );
}

export type TrackRowProps = {
  track: TrackInfo;
  isPlaying: boolean;
  isEven: boolean;
  onClicked?: () => void;
};

export const TrackRow: React.FC<TrackRowProps> = ({track, isPlaying, isEven, onClicked}) => {
  const clickEvent = () => {
    if (onClicked) {
      onClicked();
    }
  };

  return (
    <RowContainer isPlaying={isPlaying} isEven={isEven} onClick={clickEvent}>
      <TitleBox>
        <TitleText isPlaying={isPlaying}>{track.title}</TitleText>
      </TitleBox>
      <TextBox>
        <ArtistText>{track.artist}</ArtistText>
      </TextBox>
      <TextBox>
        <AlbumText>{track.album}</AlbumText>
      </TextBox>
      <TimeBox>
        <TrackTime duration={track.duration} />
      </TimeBox>
    </RowContainer>
  );
};
