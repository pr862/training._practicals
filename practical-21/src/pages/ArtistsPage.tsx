import ArtistList from "../components/Artists/ArtistList";
import { useArtists } from "../hooks/useArtists";

const ArtistsPage = () => {
  const { artists, loading } = useArtists();

  return (
    <div className="bg-black min-h-screen text-white p-6">
      <h1 className="text-3xl font-bold mb-8">All Artists</h1>
      <ArtistList
        artists={artists}
        loading={loading}
        variant="grid"
      />
    </div>
  );
};

export default ArtistsPage;
