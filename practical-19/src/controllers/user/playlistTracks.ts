import { Request, Response } from 'express';
import { Playlist, Track, PlaylistTrack } from '../../models';
import { AuthRequest } from '../../middleware/auth';

export const addTrackToUserPlaylist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const playlistId = Number(req.params.id);
    const trackId = Number(req.params.trackId);

    if (isNaN(playlistId) || isNaN(trackId)) {
      res.status(400).json({ message: "Valid playlistId and trackId required" });
      return;
    }

    const existing = await PlaylistTrack.findOne({
      where: { playlist_id: playlistId, track_id: trackId }
    });

    if (existing) {
      res.status(400).json({ message: "Track already exists in playlist" });
      return;
    }

    const maxIndex: any = await PlaylistTrack.max("index", {
      where: { playlist_id: playlistId }
    });

    const nextIndex = (maxIndex ?? -1) + 1;

    await PlaylistTrack.create({
      playlist_id: playlistId,
      track_id: trackId,
      index: nextIndex
    });

    res.json({ message: "Track added to playlist" });
  } catch (error) {
    res.status(500).json({
      message: "Error adding track to playlist",
      error: (error as Error).message
    });
  }
};

export const removeTrackFromUserPlaylist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const playlistId = Number(req.params.id);
    const trackId = Number(req.params.trackId);

    if (isNaN(playlistId) || isNaN(trackId)) {
      res.status(400).json({ message: "Valid playlistId and trackId required" });
      return;
    }

    const deleted = await PlaylistTrack.destroy({
      where: {
        playlist_id: playlistId,
        track_id: trackId
      }
    });

    res.json({
      message: "Track removed from playlist",
      deletedCount: deleted
    });
  } catch (error) {
    res.status(500).json({ message: 'Error removing tracks from playlist', error: (error as Error).message });
  }
};

