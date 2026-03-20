import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTracks } from '../hooks/useTracks';
import { useArtists } from '../hooks/useArtists';
import { useAlbums } from '../hooks/useAlbums';
import TrackList from '../components/Tracks/TrackList';
import ArtistList from '../components/Artists/ArtistList';
import AlbumList from '../components/Albums/AlbumList';
import Loading from '../components/UI/Loading';

const SearchPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract search query from URL params
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'tracks' | 'artists' | 'albums'>('tracks');

  const { tracks, loading: tracksLoading } = useTracks();
  const { artists, loading: artistsLoading } = useArtists();
  const { albums, loading: albumsLoading } = useAlbums();

  useEffect(() => {
    // Update URL when query changes
    if (query) {
      console.log('Query changed, updating URL:', query);
      navigate(`/app/search?q=${encodeURIComponent(query)}`, { replace: true });
    }
  }, [query, navigate]);

  useEffect(() => {
    // Initialize query from URL on mount
    const urlQuery = searchParams.get('q');
    console.log('SearchPage mounted, URL query:', urlQuery, 'Current query:', query);
    if (urlQuery && urlQuery !== query) {
      console.log('Setting query from URL:', urlQuery);
      setQuery(urlQuery);
    }
  }, [location.search]);

  const filteredTracks = tracks.filter(track => 
    track.title.toLowerCase().includes(query.toLowerCase()) ||
    track.artistName.toLowerCase().includes(query.toLowerCase())
  );

  const filteredArtists = artists.filter(artist => 
    artist.name.toLowerCase().includes(query.toLowerCase())
  );

  const filteredAlbums = albums.filter(album => 
    album.title.toLowerCase().includes(query.toLowerCase()) ||
    album.artistName.toLowerCase().includes(query.toLowerCase())
  );

  console.log('Search results - Tracks:', filteredTracks.length, 'Artists:', filteredArtists.length, 'Albums:', filteredAlbums.length);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="pt-24 px-6 pb-20">
        <div className="max-w-4xl mx-auto mb-8">
        </div>

        {/* Results */}
        {query && (
          <div className="max-w-7xl mx-auto">
            {/* Tabs */}
            <div className="flex gap-8 mb-8 border-b border-gray-800">
              <button
                onClick={() => setActiveTab('tracks')}
                className={`pb-4 font-semibold text-lg transition-colors ${
                  activeTab === 'tracks' 
                    ? 'text-teal-400 border-b-2 border-teal-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Tracks ({filteredTracks.length})
              </button>
              <button
                onClick={() => setActiveTab('artists')}
                className={`pb-4 font-semibold text-lg transition-colors ${
                  activeTab === 'artists' 
                    ? 'text-teal-400 border-b-2 border-teal-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Artists ({filteredArtists.length})
              </button>
              <button
                onClick={() => setActiveTab('albums')}
                className={`pb-4 font-semibold text-lg transition-colors ${
                  activeTab === 'albums' 
                    ? 'text-teal-400 border-b-2 border-teal-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Albums ({filteredAlbums.length})
              </button>
            </div>

            {/* Content */}
            {activeTab === 'tracks' && (
              <div>
                <h3 className="text-2xl font-bold mb-6">Tracks</h3>
                {tracksLoading ? (
                  <Loading />
                ) : filteredTracks.length > 0 ? (
                  <TrackList tracks={filteredTracks} loading={false} />
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    No tracks found for "{query}"
                  </div>
                )}
              </div>
            )}

            {activeTab === 'artists' && (
              <div>
                <h3 className="text-2xl font-bold mb-6">Artists</h3>
                {artistsLoading ? (
                  <Loading />
                ) : filteredArtists.length > 0 ? (
                  <ArtistList artists={filteredArtists} loading={false} />
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    No artists found for "{query}"
                  </div>
                )}
              </div>
            )}

            {activeTab === 'albums' && (
              <div>
                <h3 className="text-2xl font-bold mb-6">Albums</h3>
                {albumsLoading ? (
                  <Loading />
                ) : filteredAlbums.length > 0 ? (
                  <AlbumList albums={filteredAlbums} loading={false} />
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    No albums found for "{query}"
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!query && (
          <div className="max-w-4xl mx-auto text-center py-20">
            <h2 className="text-4xl font-bold mb-4">Search Music</h2>
            <p className="text-gray-400 text-lg">
              Enter a song, artist, or album name to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;