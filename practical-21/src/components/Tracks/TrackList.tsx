import React from "react";
import type { Track } from "../../types/api";
import TrackCard from "./TrackCard";
import GenericList from "../UI/GenericList";

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
  const renderItem = (track: Track, index: number) => {
    if (variant === "grid") {
      return (
        <TrackCard 
          key={track.id} 
          track={track} 
          index={index} 
          layout="list" 
          queue={tracks} 
        />
      );
    } else {
      return (
        <TrackCard 
          key={track.id} 
          track={track} 
          layout="home" 
          index={index} 
          queue={tracks} 
        />
      );
    }
  };

  return (
    <GenericList
      items={tracks}
      loading={loading}
      variant={variant}
      title={title}
      renderItem={renderItem}
      onShowAll={onShowAll}
      skeletonCount={6}
      gridCols="grid-cols-1"
      itemMinWidth="100%"
    />
  );
};

export default TrackList;
