import React, { useState } from 'react';
import { useTracks } from '../hooks/useTracks';
import TrackList from '../components/Tracks/TrackList';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import { useDispatch } from 'react-redux';
import { fetchTracks } from '../store/trackSlice'; 

const TracksPage: React.FC = () => {
  const { tracks, loading, error, refetch } = useTracks();
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();

  const handleSearch = () => {
    refetch();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-4">
        <Input
          placeholder="Search tracks..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleSearch}>Search</Button>
        <Button onClick={() => dispatch(fetchTracks() as any)}>Refresh</Button>
      </div>
      {error && <div className="text-red-500 p-4 bg-red-50 rounded">{error}</div>}
      <TrackList tracks={tracks} loading={loading} />
    </div>
  );
};

export default TracksPage;

