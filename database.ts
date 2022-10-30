import { Sequelize } from "sequelize"

const SCHEMA_NAME = (process.env.DB_NAME as string)
const USER_NAME = (process.env.DB_USER as string)
const PASSWORD = (process.env.DB_PASSWORD as string)
const HOST = process.env.DB_HOST
const PORT = +process.env.DB_PORT
const DRIVER = "mysql"

const sequelize = new Sequelize(
  SCHEMA_NAME,
  USER_NAME,
  PASSWORD,
  {
    host: HOST,
    dialect: DRIVER,
    port: PORT,
    logging: false,
    timezone: "+03:00"
  }
)

sequelize
  .authenticate()
    .then(() => console.log('Connected to the database.'))
    .catch()

export default sequelize