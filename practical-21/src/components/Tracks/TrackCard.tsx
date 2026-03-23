import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { Track } from "../../types/api";
import playIcon from "../../assets/play.svg";
import { playTrack, setQueue } from "../../store/playerSlice";
import type { RootState } from "../../store/store";

interface TrackCardProps {
  track: Track;
  index?: number;            // optional, for track number in list
  layout?: "home" | "list";  // "home" = square card, "list" = Spotify row
  queue?: Track[];
}

const TrackCard: React.FC<TrackCardProps> = ({ track, index, layout = "home", queue }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { currentTrack, isPlaying: isPlayerPlaying } = useSelector((state: RootState) => state.player);
  const titleInitial = track?.title?.charAt(0)?.toUpperCase() ?? "T";
  const isActive = currentTrack?.id === track.id;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src =
      "https://via.placeholder.com/300x300/1db954/ffffff?text=" +
      encodeURIComponent(titleInitial);
  };

  const fallbackSrc =
    "https://via.placeholder.com/300x300/1db954/ffffff?text=" +
    encodeURIComponent(titleInitial);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }

    if (queue && queue.length > 0) {
      dispatch(setQueue({ tracks: queue, startTrackId: track.id }));
    } else {
      dispatch(setQueue({ tracks: [track], startIndex: 0 }));
    }

    dispatch(playTrack(track));
  };

  if (layout === "list") {
    return (
      <div
        onClick={() => navigate(`/app/tracks/${track.id}`)}
        className={`flex items-center gap-4 p-2 rounded-md cursor-pointer transition-all duration-300 ${
          isActive ? "bg-white/10" : "hover:bg-neutral-700/60"
        }`}
      >
        <div className="w-8 flex items-center justify-end">
          {isActive ? (
            <div className="flex items-end gap-[2px] h-4">
              <span className={`w-[3px] rounded-sm bg-emerald-400 ${isPlayerPlaying ? "animate-pulse" : ""}`} style={{ height: 6 }} />
              <span className={`w-[3px] rounded-sm bg-emerald-400 ${isPlayerPlaying ? "animate-pulse" : ""}`} style={{ height: 12, animationDelay: "120ms" }} />
              <span className={`w-[3px] rounded-sm bg-emerald-400 ${isPlayerPlaying ? "animate-pulse" : ""}`} style={{ height: 8, animationDelay: "240ms" }} />
            </div>
          ) : index !== undefined ? (
            <span className="text-gray-400 text-right tabular-nums">{index + 1}</span>
          ) : null}
        </div>

        <img
          src={track.image || fallbackSrc}
          alt={track.title || "Track"}
          onError={handleImageError}
          className="w-12 h-12 rounded-md object-cover"
        />

        <div className="flex flex-col overflow-hidden">
          <p className="text-white font-semibold truncate">{track.title}</p>
          <p className="text-xs text-gray-400 truncate">{track.artistName || "Unknown Artist"}</p>
        </div>

        <button
          onClick={handlePlayClick}
          className="ml-auto w-10 h-10 bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300"
        >
          <img src={playIcon} alt="play" className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => navigate(`/app/tracks/${track.id}`)}
      className="group w-52 p-3 rounded-xl flex-shrink-0 cursor-pointer text-center transition-all duration-300 hover:bg-neutral-700/60 hover:scale-[1.03]"
    >
      <div className="relative">
        <img
          src={track.image || fallbackSrc}
          alt={track.title || "Track"}
          onError={handleImageError}
          className="w-44 h-44 rounded-xl object-cover shadow-md"
        />

        <button
          onClick={handlePlayClick}
          className="absolute bottom-3 right-3 w-12 h-12 
            bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500 
            rounded-full flex items-center justify-center shadow-lg 
            opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 
            transition-all duration-300 hover:scale-105"
        >
          <img src={playIcon}  alt="play" className="w-4 h-4" />
        </button>
      </div>

      <p className="mt-3 text-sm font-semibold text-white truncate">{track.title}</p>
    </div>
  );
};

export default TrackCard;
