import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GenericListProps<T> {
  items: T[];
  loading: boolean;
  variant?: "slider" | "grid";
  title?: string;
  onShowAll?: () => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  skeletonCount?: number;
  gridCols?: string;
  itemMinWidth?: string;
}

const GenericList = <T,>({
  items,
  loading,
  variant = "grid",
  title,
  onShowAll,
  renderItem,
  skeletonCount = 6,
  gridCols = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
  itemMinWidth = "180px",
}: GenericListProps<T>) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  const renderSkeleton = () => {
    const skeletonItem = variant === "slider" ? (
      <div
        key="skeleton"
        className={`h-40 rounded-xl bg-gray-800 animate-pulse flex-shrink-0 ${itemMinWidth ? `min-w-[${itemMinWidth}]` : ""}`}
      />
    ) : (
      <div
        key="skeleton"
        className="w-40 h-40 bg-gray-800 rounded-xl animate-pulse"
      />
    );

    return variant === "slider" ? (
      <div className="flex gap-4 overflow-x-auto">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <React.Fragment key={i}>
            {skeletonItem}
          </React.Fragment>
        ))}
      </div>
    ) : (
      <div className={`pt-4 grid ${gridCols} gap-4 px-4 md:px-0`}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <React.Fragment key={i}>
            {skeletonItem}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      {title && (
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
        <div className={`pt-4 grid ${gridCols} gap-4 px-4 md:px-0`}>
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {renderItem(item, index)}
            </React.Fragment>
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
            {items.map((item, index) => (
              <div key={index} className={`min-w-[${itemMinWidth}]`}>
                {renderItem(item, index)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GenericList;