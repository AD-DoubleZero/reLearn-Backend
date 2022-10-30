import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from "sequelize"
import sequelize from "../database"
import Collocation from "./collocation.model"

class CandidateToCluster extends Model<InferAttributes<CandidateToCluster>, InferCreationAttributes<CandidateToCluster>> {
  declare id:             CreationOptional<number>
  declare isPriority:     CreationOptional<boolean>

  declare CollocationId:  ForeignKey<Collocation['id']>

  declare createdAt:      CreationOptional<Date>
  declare updatedAt:      CreationOptional<Date>
}

CandidateToCluster.init({
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  isPriority: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
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

export default CandidateToCluster