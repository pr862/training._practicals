import React from "react";
import { useNavigate } from "react-router-dom";
import type { Artist } from "../../types/api";
import playIcon from "../../assets/play.svg";
import { usePlayButton } from "../../hooks/usePlayButton";
import Image from "../UI/Image";

interface ArtistCardProps {
  artist: Artist;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  const navigate = useNavigate();
  const { handlePlay } = usePlayButton({ artist });

  return (
    <div
      className="group w-52 p-3 rounded-xl flex-shrink-0 cursor-pointer text-center
        transition-all duration-300 hover:bg-neutral-700/60 hover:scale-[1.03] relative z-0 hover:z-10"
    >
      <div
        className="relative flex justify-center"
        onClick={() => artist?.id && navigate(`/app/artists/${artist.id}`)}
      >
        <Image
          src={artist.image}
          alt={artist.name || 'Artist'}
          className="w-40 h-40 rounded-full object-cover shadow-lg"
          fallbackColor="#667eea"
          fallbackText={artist.name?.charAt(0)?.toUpperCase() || 'A'}
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
