import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { artistService } from '../services/artistService';
import { useArtistTracks } from '../hooks/useArtists';
import { useArtistAlbums } from '../hooks/useArtistAlbums';
import { getImageUrl } from '../utils/imageHelper';
import TrackList from '../components/Tracks/TrackList';
import AlbumList from '../components/Albums/AlbumList';
import type { Artist } from '../types/api';

const ArtistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const {
    tracks,
    loading: tracksLoading,
    error: tracksError
  } = useArtistTracks(id || '');

  const {
    albums,
    loading: albumsLoading,
    error: albumsError
  } = useArtistAlbums(id || '');

  const [artist, setArtist] = useState<Artist | null>(null);
  const [artistLoading, setArtistLoading] = useState(true);
  const [artistError, setArtistError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchArtist = async () => {
      try {
        setArtistLoading(true);
        setArtistError('');

        const response = await artistService.getById(id);
        const data: any = response.data;

        if (data?.success && data?.data) {
          const a = data.data;

          setArtist({
            id: a.id,
            name: a.name,
            image: getImageUrl(a.image_url || a.image),
            description: a.description || ''
          });
        } else {
          setArtistError(data?.message || 'Failed to fetch artist');
        }
      } catch {
        setArtistError('Failed to fetch artist');
      } finally {
        setArtistLoading(false);
      }
    };

    fetchArtist();
  }, [id]);

  if (artistLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin h-16 w-16 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="w-full pt-20 bg-gradient-to-r from-teal-600/90 to-emerald-600/40 backdrop-blur-lg text-white">

      {artist && (
        <div className="relative w-full overflow-hidden">
          
          <div className="absolute inset-0 bg-g blur-3xl" />

          <div className="relative w-full px-4 md:px-10 py-20">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-10">

              <div className="w-40 h-40 md:w-60 md:h-60 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
              
                <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-white bg-clip-text text-transparent">
                  {artist.name}
                </h1>

                <p className="text-lg uppercase text-gray-300 mb-2">
                  Artist
                </p>

                {artist.description && (
                  <p className="text-gray-400 max-w-2xl">
                    {artist.description}
                  </p>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {artistError && (
        <div className="text-red-400 text-center py-4">{artistError}</div>
      )}
      {tracksError && (
        <div className="text-red-400 text-center py-4">{tracksError}</div>
      )}
      {albumsError && (
        <div className="text-red-400 text-center py-4">{albumsError}</div>
      )}

      <div className="w-full bg-neutral-900 px-4 md:px-10 pb-20">
        
        <div className="mb-12 pt-5  ">
          <TrackList 
            tracks={tracks} 
            loading={tracksLoading} 
            variant="grid"
            title={`${artist?.name}'s Tracks`}
          />
        </div>

        <div>
          <AlbumList albums={albums} loading={albumsLoading} />
        </div> 
      </div>
    </div>
  );
};

export default ArtistPage;