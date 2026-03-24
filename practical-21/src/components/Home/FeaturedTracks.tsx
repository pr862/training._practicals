import React from 'react';
import { useTracks } from '../../hooks/useTracks';
import Loading from '../UI/Loading';
import TrackCard from '../Tracks/TrackCard';

const FeaturedTracks: React.FC = () => {
  const { tracks, loading } = useTracks();

  if (loading) return <Loading />;

  const featured = tracks.slice(0, 8);

  return (
    <section className="py-14">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-10">
          Featured Tracks
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {featured.map((track, index) => (
            <TrackCard key={track.id} track={track} index={index} layout="home" queue={featured} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedTracks;
