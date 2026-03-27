import React from "react";
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
      onShowAll={() => window.location.href = "/app/artists"}
      skeletonCount={6}
      gridCols="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
      itemMinWidth="180px"
    />
  );
};

export default ArtistList;