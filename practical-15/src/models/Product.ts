import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';


export class Product extends Model {
  public id!: number;
  public name!: string;
  public price!: number;
  public stock!: number;
  public image!: string;
  public categoryId!: number;
}

Product.init(
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

    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'products',
  }
);
