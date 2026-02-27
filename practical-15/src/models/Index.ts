import sequelize from '../config/database';
import { User } from './User';
import { Category } from './Category';
import { Product } from './Product';
import { UserFavorite } from './UserFavorite';

Category.hasMany(Category, {as: 'subcategories',foreignKey: 'parent_id',});
Category.belongsTo(Category, {as: 'parent',foreignKey: 'parent_id',});

Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

User.hasMany(UserFavorite, { foreignKey: 'userId' });
UserFavorite.belongsTo(User, { foreignKey: 'userId' });

Product.hasMany(UserFavorite, { foreignKey: 'productId' });
UserFavorite.belongsTo(Product, { foreignKey: 'productId' });

export { sequelize, User, Category, Product, UserFavorite };
