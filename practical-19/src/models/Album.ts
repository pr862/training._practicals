import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Album extends Model {
  declare id: number;
  declare name: string;
  declare description?: string;
  declare image_url?: string;
  declare published_at?: Date;
  declare is_published: boolean;
  declare artist_id: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Album.init(
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
    published_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    artist_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'artists',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: true,
    tableName: 'albums',
  }
);

export default Album;

