import React, { useState } from 'react';
import { usePlaylists } from '../hooks/usePlaylists';
import PlaylistModal from '../components/UI/PlaylistModal';
import Button from '../components/UI/Button';

const PlaylistsPage: React.FC = () => {
  const { playlists, loading, error } = usePlaylists();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      {error && <div className="text-red-500 p-4 bg-red-50 rounded">{error}</div>}
      
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Your Playlists</h1>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500 text-black font-semibold px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300"
        >
          + Create Playlist
        </Button>
      </div>

      {/* Playlists Grid */}
      {playlists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist) => (
            <div 
              key={playlist.id} 
              className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 hover:border-teal-500/50 transition-all duration-300 group cursor-pointer"
            >
              <div className="relative mb-4">
                <img 
                  src={playlist.image} 
                  alt={playlist.title} 
                  className="w-full h-48 object-cover rounded-lg shadow-xl group-hover:shadow-2xl transition-shadow"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{playlist.title}</h3>
                  <p className="text-sm text-gray-300">{playlist.tracks.length} tracks</p>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                <span className="text-sm text-gray-400">
                  Created {playlist.createdAt ? new Date(playlist.createdAt).toLocaleDateString() : 'Unknown'}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    // Handle playlist actions like play, edit, delete
                    console.log('Playlist actions for:', playlist.title);
                  }}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎵</div>
          <h2 className="text-2xl font-bold text-gray-400 mb-2">No Playlists Yet</h2>
          <p className="text-gray-500 mb-6">Create your first playlist to get started</p>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500 text-black font-semibold"
          >
            Create Your First Playlist
          </Button>
        </div>
      )}
      
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
          <p className="text-gray-400 mt-2">Loading playlists...</p>
        </div>
      )}

      {/* Playlist Creation Modal */}
      <PlaylistModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default PlaylistsPage;

