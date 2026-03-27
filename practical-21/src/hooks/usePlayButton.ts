import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { playTrack, setQueue, setShuffle } from "../store/playerSlice";
import { trackService } from "../services/trackService";
import { getImageUrl } from "../utils/imageHelper";
import type { RootState } from "../store/store";
import type { Artist } from "../types/api";

interface UsePlayButtonOptions {
  artist?: Artist;
  tracks?: any[];
  queue?: any[];
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
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { currentTrack, isPlaying: isPlayerPlaying } = useSelector((state: RootState) => state.player);

  const handlePlay = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();

      if (!isAuthenticated) {
        navigate("/login", { state: { from: location } });
        return;
      }

      if (artist?.id) {
        try {
          const response = await trackService.getByArtist(String(artist.id));
          const apiData = response.data as unknown as { success?: unknown; data?: unknown };
          const rawTracks = apiData?.success === true && Array.isArray(apiData?.data)
            ? (apiData.data as Array<Record<string, unknown>>)
            : [];

          const str = (v: unknown): string | undefined => (typeof v === "string" && v.trim() ? v : undefined);
          const num = (v: unknown): number | undefined => {
            if (typeof v === "number" && Number.isFinite(v)) return v;
            if (typeof v === "string" && v.trim() && Number.isFinite(Number(v))) return Number(v);
            return undefined;
          };

          const tracks = rawTracks.map((t) => {
            const id =
              num(t["id"]) ??
              num(t["track_id"]) ??
              num(t["_id"]) ??
              0;

            const title =
              str(t["title"]) ??
              str(t["name"]) ??
              str(t["track_title"]) ??
              str(t["song_name"]) ??
              "Unknown Track";

            const image = getImageUrl(
              str(t["image"]) ??
                str(t["image_url"]) ??
                str(t["cover"]) ??
                str(t["thumbnail"]) ??
                ""
            );

            const audioUrl =
              str(t["audio_url"]) ??
              str(t["audio"]) ??
              str(t["track_url"]) ??
              str(t["trackUrl"]) ??
              str(t["file_url"]) ??
              str(t["stream_url"]) ??
              "";

            return {
              id,
              title,
              image,
              audioUrl,
              artistId: num(t["artist_id"]) ?? num(t["artistId"]),
              artistName: artist.name || "Unknown Artist",
              albumId: num(t["album_id"]) ?? num(t["albumId"]),
              albumTitle: str(t["album_title"]) ?? str(t["albumTitle"]),
              duration: num(t["duration"]) ?? num(t["length"]) ?? num(t["runtime"]),
              plays: num(t["plays"]) ?? num(t["play_count"]) ?? num(t["playCount"]) ?? 0,
            };
          });

          const playable = tracks.filter((t) => t.id > 0 && Boolean(t.audioUrl));
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
    [artist, tracks, dispatch, isAuthenticated, location, navigate]
  );

  const handleShuffle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (!isAuthenticated) {
        navigate("/login", { state: { from: location } });
        return;
      }

      if (tracks && tracks.length > 0) {
        const startIndex = Math.floor(Math.random() * tracks.length);
        dispatch(setQueue({ tracks, startIndex }));
        dispatch(playTrack(tracks[startIndex]));
      }
    },
    [tracks, dispatch, isAuthenticated, location, navigate]
  );

  const handlePlayToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (!isAuthenticated) {
        navigate("/login", { state: { from: location } });
        return;
      }

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
    [queue, startTrackId, tracks, currentTrack, isPlayerPlaying, dispatch, isAuthenticated, location, navigate]
  );

  return {
    handlePlay,
    handleShuffle,
    handlePlayToggle,
  };
};