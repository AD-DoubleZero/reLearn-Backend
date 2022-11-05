import { NextFunction, Request, Response } from "express";
import ApiError from "../error/ApiError";
import LanguageService from "../service/language.service";

class LanguageController {

  static async get (req: Request<{}, {}, {}, {
    UserId:     string,  // number
  }>, res: Response, next: NextFunction) {

    try {
      if (!req.query.UserId) {
        next(ApiError.badRequest("Request error"))
      }

      const result = await LanguageService.findAll()

      res.status(200).json({ data: result })
    } catch (error) {
      next(ApiError.internal("CollocationController.get error: " + error))
    }

  }

}

export default LanguageController