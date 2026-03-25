import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Playlist extends Model {
  declare id: number;
  declare name: string;
  declare description?: string;
  declare image_url?: string;
  declare is_published: boolean;
  declare user_id: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Playlist.init(
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

  },
  {
    sequelize,
    timestamps: true,
    tableName: 'playlists',
  }
);

export default Playlist;

