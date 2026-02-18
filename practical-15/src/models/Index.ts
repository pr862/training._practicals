import sequelize from '../config/database';
import { User } from './User';
import { Category } from './Category';
import { Subcategory } from './Subcategory';
import { Product } from './Product';

Category.hasMany(Subcategory, { foreignKey: 'categoryId' });
Subcategory.belongsTo(Category, { foreignKey: 'categoryId' });

Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

Subcategory.hasMany(Product, { foreignKey: 'subcategoryId' });
Product.belongsTo(Subcategory, { foreignKey: 'subcategoryId' });


export { sequelize, User, Category, Subcategory, Product};