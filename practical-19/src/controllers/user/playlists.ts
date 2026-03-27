import { Request, Response } from 'express';
import { Track,Playlist } from '../../models';


export const fetchAllPlaylists = async (req: Request, res: Response): Promise<void> => {
  try {
    const playlists = await Playlist.findAll({
      where: { is_published: true },
      include: [{
        model: Track,
        as: 'tracks',
        where: { is_published: true },
        through: { attributes: [] },
        order: [['PlaylistTrack', 'index', 'ASC']]
      }]
    });
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching playlists', error: (error as Error).message });
  }
};

export const getPlaylistById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const playlist = await Playlist.findByPk(id, {
      include: [{
        model: Track,
        as: 'tracks',
        where: { is_published: true },
        through: { attributes: [] },
        order: [['PlaylistTrack', 'index', 'ASC']]
      }]
    });
    if (!playlist || !playlist.is_published) {
      res.status(404).json({ message: 'Playlist not found' });
      return;
    }
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching playlist', error: (error as Error).message });
  }
};


