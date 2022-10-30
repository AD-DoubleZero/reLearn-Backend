import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from "sequelize"
import sequelize from "../database"
import Language from "./language.model"
import User from "./user.model"

class Collocation extends Model<InferAttributes<Collocation>, InferCreationAttributes<Collocation>> {
  declare id:             CreationOptional<number>
  declare body:           string
  declare meaning:        CreationOptional<string>
  declare transcription:  CreationOptional<string>
  declare examplesJSON:   CreationOptional<string>
  declare association:    CreationOptional<string>
  declare tagsJSON:       CreationOptional<string>
  declare lastRepeat:     CreationOptional<Date>

  declare UserId:         ForeignKey<User['id']>
  declare LanguageId:     ForeignKey<Language['id']>

  declare createdAt:      CreationOptional<Date>
  declare updatedAt:      CreationOptional<Date>
}

Collocation.init({
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  body: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  meaning: {
    type: DataTypes.STRING
  },
  transcription: {
    type: DataTypes.STRING
  },
  examplesJSON: {
    type: DataTypes.STRING, //JSON
  },
  association: {
    type: DataTypes.STRING
  },
  tagsJSON: {
    type: DataTypes.STRING, //JSON
    defaultValue: "[0]"
  },
  lastRepeat: {
    type: DataTypes.DATE,
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

export default Collocation