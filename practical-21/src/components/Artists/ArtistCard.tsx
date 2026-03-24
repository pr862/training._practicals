import React, { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Artist } from "../../types/api";
import playIcon from "../../assets/play.svg";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { playTrack, setQueue, setShuffle } from "../../store/playerSlice";
import { trackService } from "../../services/trackService";
import { getImageUrl } from "../../utils/imageHelper";

interface ArtistCardProps {
  artist: Artist;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const nameInitial = artist?.name?.charAt(0)?.toUpperCase() ?? 'A';

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    target.src =
      "https://via.placeholder.com/300x300/667eea/ffffff?text=" +
      encodeURIComponent(nameInitial);
  };

  const fallbackSrc =
    "https://via.placeholder.com/300x300/667eea/ffffff?text=" +
    encodeURIComponent(nameInitial);

  const handlePlay = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!artist?.id) return;

    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }

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
  }, [artist?.id, dispatch, isAuthenticated, location, navigate]);

  return (
    <div
      className="group w-52 p-3 rounded-xl flex-shrink-0 cursor-pointer text-center
        transition-all duration-300 hover:bg-neutral-700/60 hover:scale-[1.03]"
    >
      <div
        className="relative flex justify-center"
        onClick={() => artist?.id && navigate(`/app/artists/${artist.id}`)}
      >
        <img
          src={artist.image || fallbackSrc}
          alt={artist.name || 'Artist'}
          onError={handleImageError}
          className="w-40 h-40 rounded-full object-cover shadow-lg"
        />

        <button
          onClick={handlePlay}
          className="absolute bottom-3 right-3 w-12 h-12 
            bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500 
            rounded-full flex items-center justify-center shadow-lg 
            opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 
            transition-all duration-300 hover:scale-105"
        >
          <img src={playIcon} alt="play" className="w-4 h-4" />
        </button>
      </div>

      <p
        className="mt-4 text-base font-semibold truncate text-white cursor-pointer hover:underline"      >
        {artist.name || 'Unknown Artist'}
      </p>
      <p className="text-sm text-gray-400">Artist</p>
    </div>
  );
};

export default ArtistCard;
