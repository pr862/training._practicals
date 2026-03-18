import React from 'react';
import Navbar from '../components/Layout/Navbar';
import Hero from '../components/Home/Hero';
import FeaturedTracks from '../components/Home/FeaturedTracks';
import FeaturedArtists from '../components/Home/FeaturedArtists';
import FeaturedAlbums from '../components/Home/FeaturedAlbums';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="pt-4">
        <Hero />
        <FeaturedTracks />
        <FeaturedArtists />
        <FeaturedAlbums />
      </main>
    </div>
  );
};

export default HomePage;

