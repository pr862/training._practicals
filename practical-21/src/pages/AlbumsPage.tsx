import AlbumList from "../components/Albums/AlbumList";
import { useAlbums } from "../hooks/useAlbums"; // ✅ make sure this hook exists

const AlbumsPage = () => {
  const { albums, loading } = useAlbums();

  return (
    <div className="bg-black min-h-screen text-white p-6">
      <h1 className="text-3xl font-bold mb-8">All Albums</h1>
      <AlbumList
        albums={albums}
        loading={loading}
        variant="slider" 
        title="Top Albums"
      />
    </div>
  );
};

export default AlbumsPage;