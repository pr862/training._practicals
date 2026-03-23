import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { Album } from "../../types/api"; // ✅ make sure your Album type exists
import AlbumCard from "./AlbumCard"; // ✅ similar to ArtistCard
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  albums: Album[];
  loading: boolean;
  variant?: "slider" | "grid";
  title?: string; 
}

const AlbumList: React.FC<Props> = ({
  albums,
  loading,
  variant = "grid",
  title = "Popular Albums",
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  const renderSkeleton = () => (
    <div className="flex gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="w-40 h-40 bg-gray-800 rounded-lg animate-pulse"
        />
      ))}
    </div>
  );

  return (
    <div className="w-full">
      {(variant === "slider" || variant === "grid") && title && (
        <div className="flex justify-between mb-6 px-4 md:px-0">
          <h2 className="text-2xl font-bold">{title}</h2>
          {variant === "slider" && (
            <span
              onClick={() => navigate("/app/albums")}
              className="text-sm text-gray-400 hover:text-white cursor-pointer"
            >
              Show all
            </span>
          )}
        </div>
      )}

      {loading ? (
        renderSkeleton()
      ) : variant === "grid" ? (
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 px-4 md:px-0">
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      ) : (
        /* ✅ SLIDER */
        <div className="relative px-4 md:px-0">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 p-2 rounded-full hover:bg-black"
          >
            <ChevronLeft />
          </button>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 p-2 rounded-full hover:bg-black"
          >
            <ChevronRight />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-4"
          >
            {albums.map((album) => (
              <div key={album.id} className="min-w-[180px]">
                <AlbumCard album={album} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlbumList;