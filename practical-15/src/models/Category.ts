import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export class Category extends Model {
  public id!: number;
  public name!: string;
  public parent_id!: number | null;
  createdAt: any;
  updatedAt: any;
  
  declare parent?: Category;
  declare subcategories?: Category[];
}

Category.init(
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
    
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'categories',
  }
);