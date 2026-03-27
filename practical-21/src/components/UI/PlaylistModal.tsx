import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { usePlaylists } from '../../hooks/usePlaylists';
import { useTracks } from '../../hooks/useTracks';
import { playlistService } from '../../services/playlistService';
import Button from './Button';
import { Input } from './Input';
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
  const [formError, setFormError] = useState<string>('');

  const handleCreatePlaylist = async () => {
    setFormError('');
    if (!title.trim()) {
      setFormError('Playlist title is required.');
      return;
    }
    if (!user) {
      setFormError('Please login again.');
      return;
    }

    setIsCreating(true);
    try {
      const response = await playlistService.create({
        title,
        userId: user.id,
        image: '/api/placeholder/300/300', // Default image
        tracks: selectedTracks
      });

      if (response.success) {
        setTitle('');
        setSelectedTracks([]);
        await refetch();
        onClose();
      } else {
        setFormError(response.message || 'Failed to create playlist.');
      }
    } catch (error) {
      setFormError('Failed to create playlist.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleTrackToggle = (track: Track) => {
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
        <div className="mb-6">
          <Input
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            placeholder="Enter playlist title"
            className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400"
          />
          {formError ? (
            <div className="mt-2 text-sm text-rose-300">{formError}</div>
          ) : null}
        </div>

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
                </div>
                <span className="text-xs text-gray-400">{track.duration || '0:00'}</span>
              </div>
            ))}
          </div>
        </div>

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