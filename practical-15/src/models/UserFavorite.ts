import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export class UserFavorite extends Model {
  public id!: number;
  public userId!: number;
  public productId!: number;
}

UserFavorite.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'user_favorites',
  }
);

