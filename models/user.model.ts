import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize"
import sequelize from "../database"

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id:                   number
  declare username:             string
  declare lastSelectedLanguage: number
  declare isFullAccess:         CreationOptional<boolean>
  declare addedCount:           CreationOptional<number>
  declare repeatCount:          CreationOptional<number>

  declare createdAt:            CreationOptional<Date>
  declare updatedAt:            CreationOptional<Date>
}

export interface IUserPutAttributes extends Partial<Pick<User, "username" | "lastSelectedLanguage" | "isFullAccess" | "addedCount" | "repeatCount">> {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
  },
  lastSelectedLanguage: {
    type: DataTypes.INTEGER,
  },
  isFullAccess: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  addedCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  repeatCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
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

export default User