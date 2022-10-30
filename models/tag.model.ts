import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from "sequelize"
import sequelize from "../database"
import User from "./user.model"

class Tag extends Model<InferAttributes<Tag>, InferCreationAttributes<Tag>> {
  declare id:           CreationOptional<number>
  declare title:        string

  declare UserId:       ForeignKey<User['id']>

  declare createdAt:    CreationOptional<Date>
  declare updatedAt:    CreationOptional<Date>
}

Tag.init({
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
}, {
  sequelize,
  freezeTableName: true,
})

export default Tag