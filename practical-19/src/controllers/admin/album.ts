import { Request, Response } from 'express';
import { Album, Artist, Track } from '../../models';
import sequelize from '../../config/database';
import { QueryTypes } from 'sequelize';

export const createAlbum = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, published_at, is_published, artist_id } = req.body;

    if (!name || name.trim() === '') {
      res.status(400).json({ message: 'Name is required' });
      return;
    }
    if (!description || description.trim() === '') {
      res.status(400).json({ message: 'Description is required' });
      return;
    }
    if (!published_at) {
      res.status(400).json({ message: 'Published at is required' });
      return;
    }
    if (is_published === undefined) {
      res.status(400).json({ message: 'Is published is required' });
      return;
    }
    if (!artist_id || isNaN(Number(artist_id))) {
      res.status(400).json({ message: 'Valid artist ID is required' });
      return;
    }

    const image_url = req.file ? req.file.cloudinaryUrl : null;
    const album = await Album.create({ 
      name, 
      description, 
      image_url, 
      published_at, 
      is_published: is_published || false, 
      artist_id 
    });
    res.status(201).json(album);
  } catch (error) {
    res.status(500).json({ message: 'Error creating album', error: (error as Error).message });
  }
};

export const getAllAlbums = async (req: Request, res: Response): Promise<void> => {
  try {
    const albums = await Album.findAll({
      include: [{ model: Artist, as: 'artist' }],
    });
    res.json(albums);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching albums', error: (error as Error).message });
  }
};

export const getAlbumById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const album = await Album.findByPk(id, {
      include: [
        { model: Artist, as: 'artist' },
        { model: Track, as: 'tracks' }
      ],
    });
    if (!album) {
      res.status(404).json({ message: 'Album not found' });
      return;
    }
    res.json(album);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching album', error: (error as Error).message });
  }
};

export const updateAlbum = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, published_at, is_published, artist_id } = req.body;
    const image_url = req.file ? req.file.cloudinaryUrl : undefined;
    const album = await Album.findByPk(id);
    if (!album) {
      res.status(404).json({ message: 'Album not found' });
      return;
    }
    await album.update({ name, description, image_url, published_at, is_published, artist_id });
    res.json(album);
  } catch (error) {
    res.status(500).json({ message: 'Error updating album', error: (error as Error).message });
  }
};

export const deleteAlbum = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const album = await Album.findByPk(id);
    if (!album) {
      res.status(404).json({ message: 'Album not found' });
      return;
    }
    await album.destroy();
    res.json({ message: 'Album deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting album', error: (error as Error).message });
  }
};

export const addTrackToAlbum = async (req: Request, res: Response): Promise<void> => {
  try {
    const { albumId, trackId } = req.params;
    const currentMaxIndexRes = await sequelize.query(
      'SELECT COALESCE(MAX("index"), -1) as max_index FROM tracks WHERE "album_id" = :albumId',
      {
        replacements: { albumId: parseInt(albumId) },
        type: QueryTypes.SELECT
      }
    );
    const maxIndex = (currentMaxIndexRes[0] as any).max_index;
    const nextIndex = maxIndex + 1;

    const album = await Album.findByPk(albumId);
    if (!album) {
      res.status(404).json({ message: 'Album not found' });
      return;
    }
    const track = await Track.findByPk(trackId);
    if (!track) {
      res.status(404).json({ message: 'Track not found' });
      return;
    }
    
    await track.update({ 
      album_id: parseInt(albumId),
      index: nextIndex 
    });
    res.json({ message: 'Track added to album', track });
  } catch (error) {
    res.status(500).json({ message: 'Error adding track to album', error: (error as Error).message });
  }
};

export const removeTrackFromAlbum = async (req: Request, res: Response): Promise<void> => {
  try {
    const { albumId, trackId } = req.params;
    const track = await Track.findByPk(trackId);
    if (!track) {
      res.status(404).json({ message: 'Track not found' });
      return;
    }
    await track.update({ album_id: null });
    res.json({ message: 'Track removed from album' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing track from album', error: (error as Error).message });
  }
};


