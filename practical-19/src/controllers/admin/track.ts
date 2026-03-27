import { Request, Response } from 'express';
import { Track, Album } from '../../models';

export const createTrack = async (req: any, res: Response): Promise<void> => {
  try {
    const { name, index, album_id, is_published } = req.body;

    if (!name || name.trim() === '') {
      res.status(400).json({ message: 'Name is required' });
      return;
    }
    if (!album_id || isNaN(Number(album_id))) {
      res.status(400).json({ message: 'Valid album ID is required' });
      return;
    }

    const trackData: any = {
      name,
      index: index ? parseInt(index as string) : undefined,
      album_id: parseInt(album_id as string),
      is_published: is_published === 'true',
    };

    if (req.files?.track && req.files.track.length > 0) {
      trackData.track_url = req.files.track[0].cloudinaryUrl;
    }

    if (req.files?.image && req.files.image.length > 0) {
      trackData.image_url = req.files.image[0].cloudinaryUrl;
    }

    const track = await Track.create(trackData);
    res.status(201).json(track);
  } catch (error) {
    res.status(500).json({ message: 'Error creating track', error: (error as Error).message });
  }
};

export const getAllTracks = async (req: Request, res: Response): Promise<void> => {
  try {
    const tracks = await Track.findAll({
      include: [{ model: Album, as: 'album' }],
    });
    res.json(tracks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tracks', error: (error as Error).message });
  }
};

export const getTrackById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const track = await Track.findByPk(id, {
      include: [{ model: Album, as: 'album' }],
    });
    if (!track) {
      res.status(404).json({ message: 'Track not found' });
      return;
    }
    res.json(track);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching track', error: (error as Error).message });
  }
};

export const updateTrack = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, index, album_id, is_published } = req.body;

    if (!name || name.trim() === '') {
      res.status(400).json({ message: 'Name is required' });
      return;
    }
    if (!album_id || isNaN(Number(album_id))) {
      res.status(400).json({ message: 'Valid album ID is required' });
      return;
    }

    const track = await Track.findByPk(id);
    if (!track) {
      res.status(404).json({ message: 'Track not found' });
      return;
    }

    const updateData: any = { 
      name, 
      index: index ? parseInt(index as string) : undefined, 
      album_id: parseInt(album_id as string), 
      is_published: is_published === 'true' 
    };

    if (req.files?.track && req.files.track.length > 0) {
      updateData.track_url = req.files.track[0].cloudinaryUrl;
    }

    if (req.files?.image && req.files.image.length > 0) {
      updateData.image_url = req.files.image[0].cloudinaryUrl;
    }

    await track.update(updateData);
    res.json(track);
  } catch (error) {
    res.status(500).json({ message: 'Error updating track', error: (error as Error).message });
  }
};

export const deleteTrack = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const track = await Track.findByPk(id);
    if (!track) {
      res.status(404).json({ message: 'Track not found' });
      return;
    }
    await track.destroy();
    res.json({ message: 'Track deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting track', error: (error as Error).message });
  }
};

