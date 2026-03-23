import React from "react";
import { useNavigate } from "react-router-dom";
import type { Track } from "../../types/api";
import playIcon from "../../assets/play.svg";

interface TrackCardProps {
  track: Track;
  index?: number;            // optional, for track number in list
  layout?: "home" | "list";  // "home" = square card, "list" = Spotify row
}

const TrackCard: React.FC<TrackCardProps> = ({ track, index, layout = "home" }) => {
  const navigate = useNavigate();
  const titleInitial = track?.title?.charAt(0)?.toUpperCase() ?? "T";

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src =
      "https://via.placeholder.com/300x300/1db954/ffffff?text=" +
      encodeURIComponent(titleInitial);
  };

  const fallbackSrc =
    "https://via.placeholder.com/300x300/1db954/ffffff?text=" +
    encodeURIComponent(titleInitial);

  if (layout === "list") {
    // Spotify-style horizontal row
    return (
      <div
        onClick={() => navigate(`/app/tracks/${track.id}`)}
        className="flex items-center gap-4 p-2 rounded-md cursor-pointer hover:bg-neutral-700/60 transition-all duration-300"
      >
        {index !== undefined && (
          <span className="w-6 text-gray-400 text-right">{index + 1}</span>
        )}

        <img
          src={track.image || fallbackSrc}
          alt={track.title || "Track"}
          onError={handleImageError}
          className="w-12 h-12 rounded-md object-cover"
        />

        <div className="flex flex-col overflow-hidden">
          <p className="text-white font-semibold truncate">{track.title}</p>
        </div>

        <button
          onClick={(e) => e.stopPropagation()}
          className="ml-auto w-10 h-10 bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300"
        >
          <img src={playIcon} alt="play" className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Default: home page square card
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
          onClick={(e) => e.stopPropagation()}
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
    </div>
  );
};

export default TrackCard;