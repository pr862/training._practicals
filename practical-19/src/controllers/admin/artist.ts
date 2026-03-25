import { Request, Response } from 'express';
import { Artist } from '../../models';

export const createArtist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    const image_url = req.file ? req.file.cloudinaryUrl : null;
    const artist = await Artist.create({ name, image_url });
    res.status(201).json(artist);
  } catch (error) {
    res.status(500).json({ message: 'Error creating artist', error: (error as Error).message });
  }
};

export const getAllArtists = async (req: Request, res: Response): Promise<void> => {
  try {
    const artists = await Artist.findAll();
    res.json(artists);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching artists', error: (error as Error).message });
  }
};

export const getArtistById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const artist = await Artist.findByPk(id);
    if (!artist) {
      res.status(404).json({ message: 'Artist not found' });
      return;
    }
    res.json(artist);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching artist', error: (error as Error).message });
  }
};

export const updateArtist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const image_url = req.file ? req.file.cloudinaryUrl : undefined;
    const artist = await Artist.findByPk(id);
    if (!artist) {
      res.status(404).json({ message: 'Artist not found' });
      return;
    }
    await artist.update({ name, image_url });
    res.json(artist);
  } catch (error) {
    res.status(500).json({ message: 'Error updating artist', error: (error as Error).message });
  }
};

export const deleteArtist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const artist = await Artist.findByPk(id);
    if (!artist) {
      res.status(404).json({ message: 'Artist not found' });
      return;
    }
    await artist.destroy();
    res.json({ message: 'Artist deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting artist', error: (error as Error).message });
  }
};

