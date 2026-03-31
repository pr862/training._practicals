import React, { useMemo, useState } from "react";
import PlaylistCard from "./PlaylistCard";
import Modal from "../UI/Modal";
import TrackList from "../Tracks/TrackList";
import Loading from "../UI/Loading";
import type { Playlist } from "../../types/api";
import { useTracks } from "../../hooks/useTracks";

interface PlaylistListProps {
  playlists: Playlist[];
  loading: boolean;
  variant?: "grid" | "slider";
  title?: string;
}

const PlaylistList: React.FC<PlaylistListProps> = ({ playlists, loading, title = "Playlists" }) => {
  const [selected, setSelected] = useState<Playlist | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { tracks: allTracks } = useTracks();

  const handleDetails = (playlist: Playlist) => {
    setSelected(playlist);
    setDetailsOpen(true);
  };

  const selectedTracks = useMemo(() => {
    if (!selected) return [];

    const trackLookup = new Map(allTracks.map((track) => [track.id, track]));

    return selected.tracks.map((track) => {
      const fullTrack = trackLookup.get(track.id);

      return fullTrack ? { ...track, ...fullTrack } : track;
    });
  }, [allTracks, selected]);

  if (loading) return <Loading className="h-64" />;
  if (!playlists.length) return <div className="text-gray-400">No playlists found.</div>;

  return (
    <div className="space-y-6">
      {title && <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">{title}</h1>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {playlists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} onDetails={handleDetails} />
        ))}
      </div>

      <Modal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title={selected?.title || "Playlist"}
        size="xl"
        variant="dark"
      >
        {selected && selectedTracks.length > 0 ? (
          <TrackList tracks={selectedTracks} loading={false} title="" />
        ) : (
          <div className="text-gray-400">No tracks in this playlist.</div>
        )}
      </Modal>
    </div>
  );
};

export default PlaylistList;
