import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Artist extends Model {
  declare id: number;
  declare name: string;
  declare image_url?: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Artist.init(
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
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: true,
    tableName: 'artists',
  }
);

export default Artist;

