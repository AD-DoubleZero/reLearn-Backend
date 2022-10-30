import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from 'cors'
import sync from "./models/sync"
import botStart from "./telegramBot"
import router from "./routes"
import errorHandler from "./middleware/ErrorHandlingMiddleware"
import telegramAuthMiddleware from "./middleware/telegramAuthMiddleware"
import { FRONTEND } from "./utils/consts"

export const app = express()
const PORT = process.env.PORT || 3001

// later configure for TG
app.use(cors({
  origin: FRONTEND,
  credentials:true,            //access-control-allow-credentials:true
}))

app.use(express.json())

app.use(telegramAuthMiddleware)

app.use("/api", router)

app.use(errorHandler)

const start = async () => {
  try {
    await sync()

    app.listen(PORT)
    console.log(`Success! Server is started on port ${PORT}`)

    botStart()
    console.log(`Bot started`)
  } catch (e) {
    console.log(e)
  }
}

start()
