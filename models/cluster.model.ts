import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from "sequelize"
import sequelize from "../database"
import Language from "./language.model"
import User from "./user.model"

class Cluster extends Model<InferAttributes<Cluster>, InferCreationAttributes<Cluster>> {
  declare id:               CreationOptional<number>
  declare level:            CreationOptional<number>
  declare collocationsJSON: CreationOptional<string>
  declare isSaved:          CreationOptional<boolean>
  declare isReadyForMerge:  CreationOptional<boolean>
  declare repeatCount:      CreationOptional<number>

  declare UserId:           ForeignKey<User['id']>
  declare LanguageId:       ForeignKey<Language['id']>

  declare createdAt:        CreationOptional<Date>
  declare updatedAt:        CreationOptional<Date>
}

Cluster.init({
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  collocationsJSON: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isSaved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isReadyForMerge: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  repeatCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
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

export default Cluster