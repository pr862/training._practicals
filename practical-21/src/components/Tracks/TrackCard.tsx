import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Heart, ListPlus, Pause as PauseIcon, Play as PlayIcon, Loader2 } from "lucide-react";
import type { Track } from "../../types/api";
import type { RootState } from "../../store/store";
import { useLibrary } from "../../contexts/Library";
import AddToPlaylistModal from "../UI/AddToPlaylistModal";
import playIcon from "../../assets/play.svg";
import { usePlayButton } from "../../hooks/usePlayButton";
import Image from "../UI/Image";


interface TrackCardProps {
  track: Track;
  index?: number;
  layout?: "home" | "list";
  queue?: Track[];
}

const TrackCard: React.FC<TrackCardProps> = ({ track, index, layout = "home", queue }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { currentTrack, isPlaying: isPlayerPlaying } = useSelector((state: RootState) => state.player);
  const { favouritesLoading, isFavouriteTrack, toggleFavouriteByTrackId, isRemoveLoading } = useLibrary();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const isActive = currentTrack?.id === track.id;
  const isFavourited = isFavouriteTrack(track.id);
  const isRemoving = isRemoveLoading(track.id);

  const { handlePlayToggle } = usePlayButton({
    tracks: queue,
    startTrackId: track.id
  });

  if (layout === "list") {
    return (
      <>
        <div
          onClick={() => navigate(`/app/tracks/${track.id}`)}
          className={`flex items-center gap-4 p-2 rounded-md cursor-pointer transition-all duration-300 ${isActive ? "bg-white/10" : "hover:bg-neutral-700/60"
            }`}
        >
          <div className="w-8 flex items-center justify-end">
            {index !== undefined ? (
              <span className="text-gray-400 text-right tabular-nums">{index + 1}</span>
            ) : null}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePlayToggle(e);
              navigate(`/app/tracks/${track.id}`);
            }}
            className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 ring-1 ring-white/10 hover:ring-white/20 transition-colors"
          >
            <Image
              src={track.image}
              alt={track.title || "Track"}
              className="w-12 h-12 object-cover"
            />
            <div className={`absolute inset-0 ${isActive ? "bg-black/25" : "bg-black/0"}`} />
            <div className="absolute inset-0 flex items-center justify-center">
              {isActive && isPlayerPlaying ? (
                <PauseIcon className="w-5 h-5 text-white" />
              ) : (
                <PlayIcon className="w-5 h-5 text-white" />
              )}
            </div>
          </button>

          <div className="flex flex-col overflow-hidden">
            <p className="text-white font-semibold truncate">{track.title}</p>
            <p className="text-xs text-gray-400 truncate">{track.artistName || "Unknown Artist"}</p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              disabled={favouritesLoading || isRemoving}
              onClick={(e) => {
                e.stopPropagation();
                if (!isAuthenticated) {
                  navigate("/login", { state: { from: location } });
                  return;
                }
                void toggleFavouriteByTrackId(track.id);
              }}
              className={`inline-flex items-center justify-center w-9 h-9 rounded-full border transition-colors ${isFavourited
                  ? "border-pink-500/40 bg-pink-500/10 text-pink-300 hover:bg-pink-500/15"
                  : "border-white/10 hover:bg-white/5 text-gray-200"
                } ${favouritesLoading || isRemoving ? "opacity-60 cursor-not-allowed" : ""}`}
              title={isFavourited ? "Remove from favourites" : "Add to favourites"}
              aria-label={isFavourited ? "Remove from favourites" : "Add to favourites"}
            >
              {isRemoving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Heart className="w-4 h-4" fill={isFavourited ? "currentColor" : "none"} />
              )}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (!isAuthenticated) {
                  navigate("/login", { state: { from: location } });
                  return;
                }
                setIsAddOpen(true);
              }}
              className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-gray-200"
              title="Add to playlist"
              aria-label="Add to playlist"
            >
              <ListPlus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <AddToPlaylistModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          trackId={track.id}
          trackTitle={track.title}
        />
      </>
    );
  }

  return (
    <>
      <div
        onClick={() => navigate(`/app/tracks/${track.id}`)}
        className="group w-52 p-3 rounded-xl flex-shrink-0 cursor-pointer text-center transition-all duration-300 hover:bg-neutral-700/60 hover:scale-[1.03]"
      >
        <div className="relative">
          <Image
            src={track.image}
            alt={track.title || "Track"}
            className={`w-44 h-44 rounded-xl object-cover shadow-md ring-1 ${isActive ? "ring-emerald-400/50" : "ring-white/10"
              }`}
            fallbackColor="#1db954"
            fallbackText={track.title?.charAt(0)?.toUpperCase() || 'T'}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePlayToggle(e);
              navigate(`/app/tracks/${track.id}`);
            }}
            className="absolute bottom-3 right-3 w-12 h-12 
            bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500 
            rounded-full flex items-center justify-center shadow-lg 
            opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 
            transition-all duration-300 hover:scale-105"
          >
            <img src={playIcon} alt="play" className="w-4 h-4" />
          </button>
        </div>

        <p className="mt-3 text-sm font-semibold text-white truncate">{track.title}</p>
        <p className="mt-1 text-xs text-gray-400 truncate">{track.artistName || "Unknown Artist"}</p>
      </div>

      <AddToPlaylistModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        trackId={track.id}
        trackTitle={track.title}
      />
    </>
  );
};

export default TrackCard;
