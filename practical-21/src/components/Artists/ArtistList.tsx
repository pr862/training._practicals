import React from "react";
import { useNavigate } from "react-router-dom";
import type { Artist } from "../../types/api";
import ArtistCard from "./ArtistCard";
import GenericList from "../UI/GenericList";

interface Props {
  artists: Artist[];
  loading: boolean;
  variant?: "slider" | "grid";
  title?: string;
}

const ArtistList: React.FC<Props> = ({
  artists,
  loading,
  variant = "grid",
  title = "Popular Artists",
}) => {
  const navigate = useNavigate();

  const renderItem = (artist: Artist, _index: number) => (
    <ArtistCard key={artist.id} artist={artist} />
  );

  return (
    <GenericList
      items={artists}
      loading={loading}
      variant={variant}
      title={title}
      renderItem={renderItem}
      onShowAll={() => navigate("/app/artists")}
      itemMinWidth="180px"
    />
  );
};
export default ArtistList;