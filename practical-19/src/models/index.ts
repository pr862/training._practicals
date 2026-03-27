import { DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Artist from './Artist';
import Album from './Album';
import Track from './Track';
import Playlist from './Playlist';
import FavouriteTrack from './FavouriteTrack';
import PlaylistTrack from './PlaylistTrack'

Artist.hasMany(Album, { foreignKey: 'artist_id', as: 'albums' });
Album.belongsTo(Artist, { foreignKey: 'artist_id', as: 'artist' });

Album.hasMany(Track, { foreignKey: 'album_id', as: 'tracks' });
Track.belongsTo(Album, { foreignKey: 'album_id', as: 'album' });

User.hasMany(FavouriteTrack, { foreignKey: 'user_id', as: 'favourites' });
FavouriteTrack.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Track.hasMany(FavouriteTrack, { foreignKey: 'track_id', as: 'favourites' });
FavouriteTrack.belongsTo(Track, { foreignKey: 'track_id', as: 'track' });

User.hasMany(Playlist, { foreignKey: 'user_id', as: 'playlists' });
Playlist.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Playlist.belongsToMany(Track, {
  through: PlaylistTrack,
  foreignKey: 'playlist_id',
  otherKey: 'track_id',
  as: 'tracks'
});

Track.belongsToMany(Playlist, {
  through: PlaylistTrack,
  foreignKey: 'track_id',
  otherKey: 'playlist_id',
  as: 'playlists'
});

PlaylistTrack.belongsTo(Playlist, { foreignKey: 'playlist_id', as: 'playlist' });
PlaylistTrack.belongsTo(Track, { foreignKey: 'track_id', as: 'track' });
export {
  sequelize,
  User,
  Artist,
  Album,
  Track,
  Playlist,
  FavouriteTrack,
  PlaylistTrack,
};

