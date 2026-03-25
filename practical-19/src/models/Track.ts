import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Track extends Model {
  declare id: number;
  declare name: string;
  declare index?: number;
  declare track_url?: string;
  declare image_url?: string;
  declare album_id: number;
  declare is_published: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Track.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    index: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    track_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    album_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'albums',
        key: 'id',
      },
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    timestamps: true,
    tableName: 'tracks',
  }
);

export default Track;

