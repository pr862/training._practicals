import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { Track } from "../../types/api";
import TrackCard from "./TrackCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  tracks: Track[];
  loading: boolean;
  variant?: "slider" | "grid";
  title?: string;
  onShowAll?: () => void;
}

const TrackList: React.FC<Props> = ({
  tracks,
  loading,
  variant = "grid",
  title = "Top Tracks",
  onShowAll,
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
    <div className={`flex gap-4 ${variant === "slider" ? "overflow-x-auto" : ""}`}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="w-40 h-40 rounded-xl bg-gray-800 animate-pulse flex-shrink-0"
        />
      ))}
    </div>
  );

  return (
    <div className="w-full">
      {(variant === "slider" || variant === "grid") && title && (
        <div className="flex justify-between items-center mb-6 px-4 md:px-0">
          <h2 className="text-2xl font-bold">{title}</h2>
          {variant === "slider" && (
            <span
              onClick={() => (onShowAll ? onShowAll() : navigate("/app/tracks"))}
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
        <div className="pt-4 flex flex-col w-full gap-1">
          {tracks.map((track, i) => (
            <TrackCard key={track.id} track={track} index={i} layout="list" queue={tracks} />
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

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 p-2 rounded-full hover:bg-black"
          >
            <ChevronRight />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-hidden scroll-smooth pb-4"
          >
            {tracks.map((track, i) => (
              <TrackCard key={track.id} track={track} layout="home" index={i} queue={tracks} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackList;
