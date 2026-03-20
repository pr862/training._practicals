import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { usePlaylists } from '../../hooks/usePlaylists';
import { useTracks } from '../../hooks/useTracks';
import { playlistService } from '../../services/playlistService';
import Button from './Button';
import Input from './Input';
import Modal from './Modal';
import type { Track } from '../../types/api';
import type { RootState } from '../../store/store';

interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PlaylistModal: React.FC<PlaylistModalProps> = ({ isOpen, onClose }) => {
  const { refetch } = usePlaylists();
  const { tracks } = useTracks();
  const { user } = useSelector((state: RootState) => state.auth);
  const [title, setTitle] = useState('');
  const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreatePlaylist = async () => {
    console.log('Creating playlist with title:', title, 'tracks:', selectedTracks.length);
    if (!title.trim() || !user) {
      console.log('Cannot create playlist: missing title or user');
      return;
    }

    setIsCreating(true);
    try {
      console.log('Calling playlist service create with:', { title, userId: user.id, tracksCount: selectedTracks.length });
      const response = await playlistService.create({
        title,
        userId: user.id,
        image: '/api/placeholder/300/300', // Default image
        tracks: selectedTracks
      });

      console.log('Playlist creation response:', response);
      if (response.success) {
        console.log('Playlist created successfully');
        setTitle('');
        setSelectedTracks([]);
        refetch();
        onClose();
      } else {
        console.error('Playlist creation failed:', response);
      }
    } catch (error) {
      console.error('Failed to create playlist:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleTrackToggle = (track: Track) => {
    console.log('Toggling track selection:', track.title);
    setSelectedTracks(prev => 
      prev.find(t => t.id === track.id)
        ? prev.filter(t => t.id !== track.id)
        : [...prev, track]
    );
  };

  const handleSelectAll = () => {
    setSelectedTracks(tracks);
  };

  const handleClearAll = () => {
    setSelectedTracks([]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Playlist">
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        
        {/* Playlist Title */}
        <div className="mb-6">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter playlist title"
            className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400"
          />
        </div>

        {/* Track Selection */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Add Tracks ({tracks.length})</h3>
            <div className="flex gap-2">
              <Button onClick={handleSelectAll} size="sm" variant="outline">
                Select All
              </Button>
              <Button onClick={handleClearAll} size="sm" variant="outline">
                Clear All
              </Button>
            </div>
          </div>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {tracks.map((track) => (
              <div
                key={track.id}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all ${
                  selectedTracks.find(t => t.id === track.id)
                    ? 'bg-gradient-to-r from-teal-500/20 to-emerald-500/20 border border-teal-500/50'
                    : 'hover:bg-gray-800/50'
                }`}
                onClick={() => handleTrackToggle(track)}
              >
                <input
                  type="checkbox"
                  checked={selectedTracks.find(t => t.id === track.id) !== undefined}
                  onChange={() => handleTrackToggle(track)}
                  className="w-4 h-4 text-teal-500 bg-gray-700 border-gray-600 rounded accent-teal-500"
                />
                <img src={track.image} alt={track.title} className="w-10 h-10 rounded object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{track.title}</p>
                  <p className="text-sm text-gray-400 truncate">{track.artistName}</p>
                </div>
                <span className="text-xs text-gray-400">{track.duration || '0:00'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button 
            onClick={handleCreatePlaylist} 
            disabled={!title.trim() || isCreating}
            className="bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500 text-black font-semibold"
          >
            {isCreating ? 'Creating...' : 'Create Playlist'}
          </Button>
        </div>

        {/* Selected Tracks Count */}
        {selectedTracks.length > 0 && (
          <div className="mt-4 text-sm text-gray-400 text-center">
            {selectedTracks.length} track{selectedTracks.length !== 1 ? 's' : ''} selected
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PlaylistModal;