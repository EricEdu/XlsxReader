import { Sequelize, DataTypes, Model } from 'sequelize';

class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
}

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
  }
);

export { sequelize, User };
