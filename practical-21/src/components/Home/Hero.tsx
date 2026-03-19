import React from 'react';
import { useTracks } from '../../hooks/useTracks';

const Hero: React.FC = () => {
  const { loading } = useTracks();

  if (loading) return (
    <div className="h-96 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    </div>
  );

  return (
    <section className="relative h-96 flex items-center justify-center text-white overflow-hidden">
    </section>
  );
};

export default Hero;
