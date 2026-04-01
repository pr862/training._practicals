import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { playTrack, setQueue, setShuffle } from "../store/playerSlice";
import { trackService } from "../services/track";
import type { RootState } from "../store/store";
import type { Artist, Track } from "../types/api";
import { mapTrack } from "../utils/mappers";
import { unwrapApiList } from "../utils/apiResponse";

interface UsePlayButtonOptions {
  artist?: Artist;
  tracks?: Track[];
  queue?: Track[];
  startTrackId?: number;
}

interface UsePlayButtonReturn {
  handlePlay: (e: React.MouseEvent) => void;
  handleShuffle: (e: React.MouseEvent) => void;
  handlePlayToggle: (e: React.MouseEvent) => void;
}

export const usePlayButton = ({
  artist,
  tracks,
  queue,
  startTrackId,
}: UsePlayButtonOptions = {}): UsePlayButtonReturn => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentTrack, isPlaying: isPlayerPlaying } = useSelector((state: RootState) => state.player);

  const handlePlay = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();

      if (artist?.id) {
        try {
          const response = await trackService.getByArtist(String(artist.id));
          const { items, ok } = unwrapApiList<any>(response.data);
          const artistTracks = ok ? items.map(mapTrack) : [];
          const playable = artistTracks.filter((t) => t.id > 0 && Boolean(t.audioUrl));
          if (playable.length > 0) {
            dispatch(setShuffle(false));
            dispatch(setQueue({ tracks: playable, startIndex: 0 }));
            dispatch(playTrack(playable[0]));
          }
        } finally {
          navigate(`/app/artists/${artist.id}`);
        }
      } else if (tracks && tracks.length > 0) {
        dispatch(setQueue({ tracks, startIndex: 0 }));
        dispatch(playTrack(tracks[0]));
      }
    },
    [artist, tracks, dispatch, navigate]
  );

  const handleShuffle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (tracks && tracks.length > 0) {
        const startIndex = Math.floor(Math.random() * tracks.length);
        dispatch(setQueue({ tracks, startIndex }));
        dispatch(playTrack(tracks[startIndex]));
      }
    },
    [tracks, dispatch]
  );

  const handlePlayToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      const isActive = currentTrack?.id === startTrackId;
      
      if (isActive) {
        dispatch(isPlayerPlaying ? { type: "player/pause" } : { type: "player/play" });
        return;
      }

      if (queue && queue.length > 0) {
        dispatch(setQueue({ tracks: queue, startTrackId }));
      } else if (tracks && tracks.length > 0) {
        dispatch(setQueue({ tracks, startIndex: 0 }));
      }

      if (tracks && tracks.length > 0) {
        const trackToPlay = tracks.find(t => t.id === startTrackId) || tracks[0];
        dispatch(playTrack(trackToPlay));
      }
    },
    [queue, startTrackId, tracks, currentTrack, isPlayerPlaying, dispatch]
  );

  return {
    handlePlay,
    handleShuffle,
    handlePlayToggle,
  };
};
