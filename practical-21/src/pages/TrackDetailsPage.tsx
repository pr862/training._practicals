import React, { useMemo } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Play } from "lucide-react";

import { useTracks } from "../hooks/useTracks";
import { playTrack, setQueue } from "../store/playerSlice";
import type { Track } from "../types/api";
import Button from "../components/UI/Button";

const TrackDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tracks, loading, error } = useTracks();

  const trackId = Number(id);

  const track = useMemo<Track | undefined>(() => {
    if (!Number.isFinite(trackId)) return undefined;
    return tracks.find((t) => t.id === trackId);
  }, [trackId, tracks]);

  const handlePlay = () => {
    if (!track) return;
    dispatch(setQueue({ tracks, startTrackId: track.id }));
    dispatch(playTrack(track));
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-6 pb-28">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold">Track</h1>
      </div>

      {loading ? (
        <div className="animate-pulse flex gap-6 items-center">
          <div className="w-44 h-44 bg-gray-800 rounded-2xl" />
          <div className="flex-1 space-y-3">
            <div className="h-6 w-64 bg-gray-800 rounded" />
            <div className="h-4 w-40 bg-gray-800 rounded" />
            <div className="h-10 w-36 bg-gray-800 rounded-full" />
          </div>
        </div>
      ) : error ? (
        <div className="text-rose-400">{error}</div>
      ) : !track ? (
        <div className="text-gray-300">Track not found.</div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <img
            src={track.image}
            alt={track.title}
            className="w-56 h-56 rounded-2xl object-cover shadow-xl"
          />

          <div className="flex-1 min-w-0">
            <h2 className="text-3xl font-bold truncate">{track.title}</h2>
            <div className="mt-2 text-gray-300 flex items-center gap-2">
              <span className="truncate">{track.artistName || "Unknown Artist"}</span>
              {typeof track.albumTitle === "string" && track.albumTitle.length > 0 ? (
                <>
                  <span className="text-gray-600">•</span>
                  <span className="truncate">{track.albumTitle}</span>
                </>
              ) : null}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button onClick={handlePlay} variant="primary" className="rounded-full px-6">
                <Play className="w-4 h-4 mr-2" />
                Play
              </Button>
              {track.artistId ? (
                <Button
                  onClick={() => navigate(`/app/artists/${track.artistId}`)}
                  variant="primary"
                  className="rounded-full px-6"
                >
                  View Artist
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackDetailsPage;
