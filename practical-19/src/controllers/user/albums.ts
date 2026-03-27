import { Request, Response } from 'express';
import { Track, Album, Artist } from '../../models';

const toInt = (value: unknown): number | null => {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : null;
};


export const fetchAllAlbums = async (req: Request, res: Response): Promise<void> => {
  try {
    const albums = await Album.findAll({
      where: { is_published: true },
      include: [{ model: Artist, as: 'artist' }],
    });
    res.json({ success: true, data: albums });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching albums', error: (error as Error).message });
  }
};

export const fetchTracksByAlbum = async (req: Request, res: Response): Promise<void> => {
  try {
    const albumId = toInt(req.params.albumId);
    if (!albumId) {
      res.status(400).json({ success: false, message: 'Valid albumId is required' });
      return;
    }

    const tracks = await Track.findAll({
      where: { album_id: albumId, is_published: true },
      include: [
        {
          model: Album,
          as: 'album',
          include: [{ model: Artist, as: 'artist' }],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, data: tracks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching tracks', error: (error as Error).message });
  }
};

