import { Response } from 'express';
import { FavouriteTrack, Track, Album, Artist } from '../../models';
import { AuthRequest } from '../../middleware/auth';

const toInt = (value: unknown): number | null => {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : null;
};

export const favouriteTrack = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const trackId = toInt(req.params.trackId);

    if (!trackId) {
      res.status(400).json({ success: false, message: 'Valid trackId is required' });
      return;
    }
    
    const track = await Track.findByPk(trackId);
    if (!track) {
      res.status(404).json({ success: false, message: 'Track not found' });
      return;
    }
    
    const existing = await FavouriteTrack.findOne({
      where: { user_id: userId, track_id: trackId }
    });
    
    if (existing) {
      res.status(400).json({ success: false, message: 'Track already favorited' });
      return;
    }
    
    const favourite = await FavouriteTrack.create({
      user_id: userId,
      track_id: trackId,
      index: 0
    });
    
    const created = await FavouriteTrack.findByPk(favourite.id, {
      include: [
        {
          model: Track,
          as: 'track',
          include: [
            {
              model: Album,
              as: 'album',
              include: [{ model: Artist, as: 'artist' }],
            },
          ],
        },
      ],
    });

    res.status(201).json({ success: true, data: created ?? favourite, message: 'Track favorited' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error favoriting track', error: (error as Error).message });
  }
};


export const unfavouriteTrack = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const trackId = toInt(req.params.trackId);

    if (!trackId) {
      res.status(400).json({ success: false, message: 'Valid trackId is required' });
      return;
    }
    
    const favourite = await FavouriteTrack.findOne({
      where: { user_id: userId, track_id: trackId }
    });
    
    if (!favourite) {
      res.status(404).json({ success: false, message: 'Favourite track not found' });
      return;
    }
    
    await favourite.destroy();
    res.json({ success: true, data: { id: favourite.id, trackId }, message: 'Track unfavorited' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error unfavoriting track', error: (error as Error).message });
  }
};



export const getUserFavourites = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = toInt(req.params.userId);
    
    if (!userId) {
      res.status(400).json({ success: false, message: 'Valid userId is required' });
      return;
    }
    
    const favourites = await FavouriteTrack.findAll({
      where: { user_id: userId },
      include: [{
        model: Track,
        as: 'track',
        include: [
          {
            model: Album,
            as: 'album',
            include: [{ model: Artist, as: 'artist' }],
          },
        ],
      }],
      order: [['index', 'ASC']]
    });
    
    res.json({ success: true, data: favourites });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching user favorites', error: (error as Error).message });
  }
};
