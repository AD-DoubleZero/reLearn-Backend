import { NextFunction, Request, Response } from "express";
import ApiError from "../error/ApiError";
import CryptoJS from "crypto-js"

const telegramAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.method === "OPTIONS" && next()

  const initData = req.headers.Authorization as string

  if (!initData) {
    next(ApiError.forbidden("no initData"))
  }

  const parsedInitData = new URLSearchParams(initData)

  const hash = parsedInitData.get("hash")
  let dataToCheck: string[] = [];

  parsedInitData.sort()
  parsedInitData.forEach((val, key) => key !== "hash" && dataToCheck.push(`${key}=${val}`))

  const secret = CryptoJS.HmacSHA256(process.env.BOT_API_TOKEN as string, "WebAppData")
  const _hash = CryptoJS.HmacSHA256(dataToCheck.join("\n"), secret).toString(CryptoJS.enc.Hex)

  if (_hash === hash) {
    next()
  } else {
    next(ApiError.forbidden("bad initData"))
  }
}

export default telegramAuthMiddleware