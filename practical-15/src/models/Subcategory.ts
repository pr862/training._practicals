import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export class Subcategory extends Model {
  public id!: number;
  public name!: string;
  public categoryId!: number;
}

Subcategory.init(
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

    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'subcategories',
  }
);