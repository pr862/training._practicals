import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Track from '../../models/Track';
import Album from '../../models/Album';
import Artist from '../../models/Artist';
import sequelize from '../../config/database';

export const fetchAllArtists = async (req: Request, res: Response): Promise<void> => {
  try {
    const artists = await Artist.findAll();
    res.json(artists);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching artists', error: (error as Error).message });
  }
};

export const getArtistById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const artist = await Artist.findByPk(id);
    
    if (!artist) {
      return res.status(404).json({ success: false, message: 'Artist not found' });
    }
    
    res.json({ success: true, data: artist });
  } catch (error: any) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getArtistTracks = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const artistAlbums = await Album.findAll({
      where: { artist_id: id },
      attributes: ['id']
    });
    
    const albumIds = artistAlbums.map(a => a.id);
    
    if (albumIds.length === 0) {
      return res.json({success: true, data: []});
    }
    
    const tracks = await Track.findAll({
      where: { album_id: { [Op.in]: albumIds } },
      include: [{
        model: Album,
        as: 'album',
        include: [{
          model: Artist,
          as: 'artist',
          attributes: ['id', 'name']
        }]
      }],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({success: true, data: tracks});
  } catch (error: any) {
    res.status(500).json({success: false, message: (error as Error).message});
  }
};

export const getArtistAlbums = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const albums = await Album.findAll({
      where: { artist_id: id },
      order: [['createdAt', 'DESC']]
    });
    
    res.json({success: true, data: albums});
  } catch (error: any) {
    res.status(500).json({success: false, message: (error as Error).message});
  }
};
