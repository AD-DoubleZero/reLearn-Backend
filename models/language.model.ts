import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize"
import sequelize from "../database"

class Language extends Model<InferAttributes<Language>, InferCreationAttributes<Language>> {
  declare id:           CreationOptional<number>
  declare title:        string

  declare createdAt:    CreationOptional<Date>
  declare updatedAt:    CreationOptional<Date>
}

Language.init({
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

export default Language