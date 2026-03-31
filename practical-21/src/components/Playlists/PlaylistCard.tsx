import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Play, Shuffle } from "lucide-react";
import Button from "../UI/Button";
import type { Playlist } from "../../types/api";
import { playTrack, setQueue } from "../../store/playerSlice";
import type { RootState } from "../../store/store";
import { useTracks } from "../../hooks/useTracks";

interface PlaylistCardProps {
  playlist: Playlist;
  onDetails: (playlist: Playlist) => void;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, onDetails }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { tracks: allTracks } = useTracks();

  const playlistTracks = useMemo(() => {
    const trackLookup = new Map(allTracks.map((track) => [track.id, track]));

    return (playlist.tracks || []).map((track) => {
      const fullTrack = trackLookup.get(track.id);

      return fullTrack ? { ...track, ...fullTrack } : track;
    });
  }, [allTracks, playlist.tracks]);

  const handlePlay = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    const tracks = playlistTracks;
    if (!tracks.length) return;

    dispatch(setQueue({ tracks, startIndex: 0 }));
    dispatch(playTrack(tracks[0]));
  };

  const handleShuffle = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    const tracks = playlistTracks;
    if (!tracks.length) return;

    const startIndex = Math.floor(Math.random() * tracks.length);
    dispatch(setQueue({ tracks, startIndex }));
    dispatch(playTrack(tracks[startIndex]));
  };

  return (
    <div className="bg-[#0e0e12] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative w-full h-48">
        <img
          src={playlist.image}
          alt={playlist.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full bg-black/70 p-3">
          <h3 className="text-white font-semibold text-lg truncate">{playlist.title}</h3>
          <p className="text-gray-300 text-sm">{playlist.tracks?.length || 0} tracks</p>
        </div>
      </div>

      <div className="flex items-center justify-between p-3 border-t border-gray-800">
        <span className="text-gray-400 text-sm">
          Created {playlist.createdAt ? new Date(playlist.createdAt).toLocaleDateString() : "Unknown"}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePlay}
            className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors"
          >
            <Play className="w-4 h-4 text-white" />
          </button>

          <button
            onClick={handleShuffle}
            className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors"
          >
            <Shuffle className="w-4 h-4 text-white" />
          </button>

          <Button size="sm" variant="outline" onClick={() => onDetails(playlist)}>
            Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistCard;
