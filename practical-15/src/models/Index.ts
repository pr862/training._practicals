import sequelize from '../config/database';
import { User } from './User';
import { Category } from './Category';
import { Subcategory } from './Subcategory';
import { Product } from './Product';
import { UserFavorite } from './UserFavorite';

Category.hasMany(Subcategory, { foreignKey: 'categoryId' });
Subcategory.belongsTo(Category, { foreignKey: 'categoryId' });

Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

Subcategory.hasMany(Product, { foreignKey: 'subcategoryId' });
Product.belongsTo(Subcategory, { foreignKey: 'subcategoryId' });

User.hasMany(UserFavorite, { foreignKey: 'userId' });
UserFavorite.belongsTo(User, { foreignKey: 'userId' });

Product.hasMany(UserFavorite, { foreignKey: 'productId' });
UserFavorite.belongsTo(Product, { foreignKey: 'productId' });

export { sequelize, User, Category, Subcategory, Product, UserFavorite };
