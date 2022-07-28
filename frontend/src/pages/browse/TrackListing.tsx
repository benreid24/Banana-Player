import React from 'react';
import styled from 'styled-components';

import {TrackRow} from 'components/TrackRow';
import {TrackInfo} from 'lib/types';

const TracksArea = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 25%;
  min-width: 50%;
  max-width: 1100px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 30px;
  overflow-y: auto;
`;

export type TracksListingProps = {
  tracks: TrackInfo[];
};

export const TrackListing: React.FC<TracksListingProps> = ({tracks}) => {
  const renderedTracks = tracks.map((track, i) => (
    <TrackRow key={`${track.title}:${track.artist}`} track={track} isEven={i % 2 === 0} isPlaying={false} />
  ));

  return (
    <TracksArea>
      {renderedTracks}
    </TracksArea>
  );
};
