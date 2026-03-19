import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { artistService } from '../services/artistService';
import { useArtistTracks } from '../hooks/useArtists';
import { getImageUrl } from '../utils/imageHelper';
import TrackList from '../components/Tracks/TrackList';
import type { Artist } from '../types/api';

const ArtistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const {
    tracks,
    loading: tracksLoading,
    error: tracksError
  } = useArtistTracks(id || '');

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

          const mappedArtist: Artist = {
            id: a.id,
            name: a.name,
            image: getImageUrl(a.image_url || a.image),
            description: a.description || ''
          };

          setArtist(mappedArtist);
        } else {
          setArtistError(data?.message || 'Failed to fetch artist');
        }
      } catch (err) {
        setArtistError('Failed to fetch artist');
      } finally {
        setArtistLoading(false);
      }
    };

    fetchArtist();
  }, [id]);

  if (artistLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
      
      {/* Artist Header */}
      {artist && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-indigo-900/50 to-pink-900/50 blur-2xl" />

          <div className="relative max-w-7xl mx-auto px-6 py-24">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10">
              
              <div className="w-48 h-48 lg:w-64 lg:h-64 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-black/30">
                <img
                  src={artist.image || 'https://via.placeholder.com/300'}
                  alt={artist.name || 'Artist'}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>

              <div className="flex-1">
                <h1 className="text-5xl lg:text-6xl font-black mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                  {artist.name || 'Unknown Artist'}
                </h1>

                <p className="text-lg text-gray-300 mb-4">
                  {tracks.length} tracks
                </p>

                {artist.description && (
                  <p className="text-gray-400 max-w-2xl leading-relaxed">
                    {artist.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Errors */}
      {artistError && (
        <div className="text-red-400 text-center py-6">{artistError}</div>
      )}
      {tracksError && (
        <div className="text-red-400 text-center py-6">{tracksError}</div>
      )}

      {/* Tracks */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <TrackList tracks={tracks} loading={tracksLoading} />
      </div>
    </div>
  );
};

export default ArtistPage;