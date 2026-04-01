import React from "react";
import { useNavigate } from "react-router-dom";
import type { Album } from "../../types/api";
import AlbumCard from "./AlbumCard";
import GenericList from "../UI/GenericList";

interface Props {
  albums: Album[];
  loading: boolean;
  variant?: "slider" | "grid";
  title?: string;
  onShowAll?: () => void;
}

const AlbumList: React.FC<Props> = ({
  albums,
  loading,
  variant = "grid",
  title = "Popular Albums",
  onShowAll,
}) => {
  const navigate = useNavigate();

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
      onShowAll={onShowAll ?? (() => navigate("/app/albums"))}
      itemMinWidth="180px"
    />
  );
};
export default AlbumList;
