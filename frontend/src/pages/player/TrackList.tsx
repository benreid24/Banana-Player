import React from 'react';
import styled from 'styled-components';

import {TrackInfo} from 'lib/types';
import { TrackRow } from 'components/TrackRow';

const Container = styled.div`
  max-width: 90%;
  min-width: 75%;
  margin-left: auto;
  margin-right: auto;
  max-height: 80%;
  align-self: top;
  flex-grow: 1;
  overflow-y: auto;
`;

const OverlayContainer = styled.div`
  position: relative;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;

const OverlayBackground = styled.div`
  border-radius: 10px;
  margin: 30px;
  background-color: rgba(197, 199, 103, 0.8);
`;

type OverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  track?: TrackInfo;
  index?: number;
};

const Overlay: React.FC<OverlayProps> = ({isOpen, onClose, track, index}) => {
  if (!isOpen || !track || !index) {
    return <></>
  }

  return (
    <OverlayContainer>
      <OverlayBackground>
        Overlay here
      </OverlayBackground>
    </OverlayContainer>
  );
};

export type TrackListProps = {
  tracks: TrackInfo[];
  onTrackRemove?: (index: number) => void;
  onTrackPlay: (index: number) => void;
  nowPlaying: number; // -1 if not playing the list being shown
};

export const TrackList: React.FC<TrackListProps> = (
  {tracks, onTrackRemove, onTrackPlay, nowPlaying}
) => {
  const [showOverlay, setShowOverlay] = React.useState<boolean>(false);
  const [selectedTrack, setSelectedTrack] = React.useState<TrackInfo | undefined>(undefined);
  const [selectedIndex, setSelectedIndex] = React.useState<number | undefined>(undefined);

  const openOverlay = (track: TrackInfo, index: number) => {
    setSelectedIndex(index);
    setSelectedTrack(track);
    setShowOverlay(true);
  };

  const renderedTracks = tracks.map((track, i) => (
    <TrackRow
      track={track}
      isEven={i % 2 === 0}
      isPlaying={nowPlaying === i}
      onClicked={() => openOverlay(track, i)}
    />
  ));

  return (
    <Container>
      {renderedTracks}
      <Overlay
        isOpen={showOverlay}
        track={selectedTrack}
        index={selectedIndex}
        onClose={() => setShowOverlay(false)}
      />
    </Container>
  );
};
