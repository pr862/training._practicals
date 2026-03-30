import React from "react";
import type { Album } from "../../types/api";
import AlbumCard from "./AlbumCard";
import GenericList from "../UI/GenericList";

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
  const renderItem = (album: Album, _index: number) => (
    <AlbumCard key={album.id} album={album} />
  );

  return (
    <GenericList
      items={albums}
      loading={loading}
      variant={variant}
      title={title}
      renderItem={renderItem}
      onShowAll={() => window.location.href = "/app/albums"}
      itemMinWidth="180px"
    />
  );
};
export default AlbumList;