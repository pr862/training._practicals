import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Track, Album, Artist } from '../../models';

const toInt = (value: unknown): number | null => {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : null;
};

export const fetchAllTracks = async (req: Request, res: Response): Promise<void> => {
  try {
    const albumId = toInt(req.query.albumId ?? req.query.album_id);
    const where: any = { is_published: true };
    if (albumId) where.album_id = albumId;

    const tracks = await Track.findAll({
      where,
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



