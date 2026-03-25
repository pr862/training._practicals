import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class PlaylistTrack extends Model {
  declare id: number;
  declare playlist_id: number;
  declare track_id: number;
  declare index?: number;
}

PlaylistTrack.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    playlist_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'playlists',
        key: 'id',
      },
    },
    track_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tracks',
        key: 'id',
      },
    },
    index: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: false,
    tableName: 'PlaylistTracks',
  }
);

export default PlaylistTrack;
