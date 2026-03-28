import { Request, Response } from "express";
import { Playlist, Track, PlaylistTrack } from "../../models";
import sequelize from "../../config/database";

export const createPlaylist = async (req: Request & { file?: any; user?: any }, res: Response): Promise<void> => {
  try {
    const { name, description, image_url, is_published } = req.body;

    if (!name || name.trim() === '') {
      res.status(400).json({ message: 'Name is required' });
      return;
    }
    if (!description || description.trim() === '') {
      res.status(400).json({ message: 'Description is required' });
      return;
    }

    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized user' });
      return;
    }

    const playlist = await Playlist.create({
      name,
      description,
      image_url: req.files?.image?.[0]?.cloudinaryUrl ?? image_url,
      is_published: is_published === true || is_published === "true",
      user_id: userId,
    });

    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({
      message: "Error creating playlist",
      error: (error as Error).message,
    });
  }
};

export const getAllPlaylists = async (req: Request, res: Response): Promise<void> => {
  try {
    const playlists = await Playlist.findAll({
      include: [
        {
          model: Track,
          as: "tracks",
          where: { is_published: true },
          required: false,
          through: { attributes: [] }
        }
      ],
      order: [[{ model: Track, as: "tracks" }, PlaylistTrack, "index", "ASC"]]
    });

    res.json(playlists);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching playlists",
      error: (error as Error).message
    });
  }
};

export const getPlaylistById = async (req: Request, res: Response): Promise<void> => {
  try {
    const playlistId = Number(req.params.id);

    const playlist = await Playlist.findByPk(playlistId, {
      include: [
        {
          model: Track,
          as: "tracks",
          where: { is_published: true },
          required: false,
          through: { attributes: [] }
        }
      ],
      order: [[{ model: Track, as: "tracks" }, PlaylistTrack, "index", "ASC"]]
    });

    if (!playlist) {
      res.status(404).json({ message: "Playlist not found" });
      return;
    }

    res.json(playlist);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching playlist",
      error: (error as Error).message
    });
  }
};

export const updatePlaylist = async (req: Request & { file?: any }, res: Response): Promise<void> => {
  try {
    const playlistId = Number(req.params.id);

    const playlist = await Playlist.findByPk(playlistId);

    if (!playlist) {
      res.status(404).json({ message: "Playlist not found" });
      return;
    }

    const { name, description, image_url, is_published } = req.body;

    const updateData: any = {
      ...(name && { name }),
      ...(description && { description }),
      ...(is_published !== undefined && { is_published })
    };

    if (req.files?.image?.[0]) {
      updateData.image_url = req.files.image[0].cloudinaryUrl;
    } else if (image_url) {
      updateData.image_url = image_url;
    }

    await playlist.update(updateData);

    res.json(playlist);
  } catch (error) {
    res.status(500).json({
      message: "Error updating playlist",
      error: (error as Error).message
    });
  }
};

export const deletePlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const playlistId = Number(req.params.id);

    const playlist = await Playlist.findByPk(playlistId);

    if (!playlist) {
      res.status(404).json({ message: "Playlist not found" });
      return;
    }

    await playlist.destroy();

    res.json({ message: "Playlist deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting playlist",
      error: (error as Error).message
    });
  }
};

export const addTrackToPlaylist = async (req: Request, res: Response): Promise<void> => {
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

export const removeTrackFromPlaylist = async (req: Request, res: Response): Promise<void> => {
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

