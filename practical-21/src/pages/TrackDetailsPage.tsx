import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pause, Play } from "lucide-react";

import { useTracks } from "../hooks/useTracks";
import { pause, play, playTrack, setQueue } from "../store/playerSlice";
import type { Track } from "../types/api";
import Button from "../components/UI/Button";
import type { RootState } from "../store/store";
import AddToPlaylistModal from "../components/UI/AddToPlaylistModal";
import TrackList from "../components/Tracks/TrackList";

const TrackDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentTrack, isPlaying } = useSelector((state: RootState) => state.player);

  const { tracks, loading, error } = useTracks();

  const [isAddOpen, setIsAddOpen] = useState(false);

  const trackId = Number(id);

  const track = useMemo<Track | undefined>(() => {
    if (!Number.isFinite(trackId)) return undefined;
    return tracks.find((t) => t.id === trackId);
  }, [trackId, tracks]);

  const isActive = Boolean(track && currentTrack?.id === track.id);

  const handlePlayToggle = () => {
    if (!track) return;

    if (isActive) {
      dispatch(isPlaying ? pause() : play());
      return;
    }

    dispatch(setQueue({ tracks, startTrackId: track.id }));
    dispatch(playTrack(track));
  };

  return (
  <div className="w-full text-white">

    <div className="w-full bg-gradient-to-b from-pink-800/90 to-transparent">
      {track && (
        <div className="relative w-full overflow-hidden">
          <div className="px-4 md:px-10 py-20">
            <button
              onClick={() => navigate(-1)}
              className="mb-6 p-2 rounded-full hover:bg-white/10"
            >
              <ArrowLeft />
            </button>

            <div className="flex flex-col md:flex-row items-center gap-10">

              <div className="w-44 h-44 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={track.image}
                  alt={track.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
                  {track.title}
                </h1>

                <p className="text-gray-300 text-lg">
                  {track.artistName || "Unknown Artist"}
                </p>

                {track.albumTitle && (
                  <p className="text-gray-400 mt-1">
                    Album: {track.albumTitle}
                  </p>
                )}

                <div className="mt-6 flex gap-3">
                  <Button
                    onClick={handlePlayToggle}
                    className="bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500 text-black rounded-full px-6"
                  >
                    {isActive && isPlaying ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" /> Play
                      </>
                    )}
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>

    <div className="w-full md:px-10 pb-20 pt-6 min-h-screen">
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : !track ? (
        <p className="text-gray-300">Track not found</p>
      ) : (
        <TrackList
          tracks={[track]}
          loading={false}
          variant="grid"
          title="Track"
        />
      )}
    </div>

    {track && (
      <AddToPlaylistModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        trackId={track.id}
        trackTitle={track.title}
      />
    )}
  </div>
);
};

export default TrackDetailsPage;