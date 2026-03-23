import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { Artist } from "../../types/api";
import ArtistCard from "./ArtistCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  artists: Artist[];
  loading: boolean;
  variant?: "slider" | "grid";
}

const ArtistList: React.FC<Props> = ({
  artists,
  loading,
  variant = "grid", // ✅ SAFE DEFAULT (important fix)
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
          className="w-40 h-40 bg-gray-800 rounded-full animate-pulse"
        />
      ))}
    </div>
  );

  return (
    <div className="w-full">
      
      {/* ✅ ONLY SHOW IN HOME */}
      {variant === "slider" && (
        <div className="flex justify-between mb-6 px-4 md:px-0">
          <h2 className="text-2xl font-bold">Popular artists</h2>

          <span
            onClick={() => navigate("/app/artists")}
            className="text-sm text-gray-400 hover:text-white cursor-pointer"
          >
            Show all
          </span>
        </div>
      )}

      {loading ? (
        renderSkeleton()
      ) : variant === "grid" ? (
        <div className="pt-20  grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 px-5">
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      ) : (
        <div className="relative px-4 md:px-0">

          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 p-2 rounded-full hover:bg-black"
          >
            <ChevronLeft />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 p-2 rounded-full hover:bg-black"
          >
            <ChevronRight />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-hidden scroll-smooth"
          >
            {artists.map((artist) => (
              <div key={artist.id} className="min-w-[180px]">
                <ArtistCard artist={artist} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistList;