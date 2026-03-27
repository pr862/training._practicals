import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class FavouriteTrack extends Model {
  declare id: number;
  declare track_id: number;
  declare user_id: number;
  declare index?: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

FavouriteTrack.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    track_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tracks',
        key: 'id',
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
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
    timestamps: true,
    tableName: 'favourite_tracks',
  }
);

export default FavouriteTrack;

