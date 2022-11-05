import { NextFunction, Request, Response } from "express";
import ApiError from "../error/ApiError";
import CollocationService from "../service/collocation.service";

class CollocationController {

  async get(req: Request<{}, {}, {}, {
    UserId:     string,  // number
    LanguageId: string,  // number
    body?:      string,  //
    sorting?:   string,  //
    tags?:      string,  // ITag[],
    page?:      string,  // number
    limit?:     string,  // number
  }>, res: Response, next: NextFunction) {

    try {
      const {
        UserId,
        LanguageId,
      } = req.query

      if (!UserId || !LanguageId) {
        next(ApiError.badRequest("Request error"))
      }

      const conditions = CollocationService.parseQueriesToFind(req.query)

      const result = await CollocationService.find(conditions)

      res.status(200).json({ data: result })
    } catch (error) {
      return next(ApiError.internal("CollocationController.get internal error: " + error))
    }

  }

  async put(req: Request<{}, {}, {
    CollocationId:  string // number
    changesJSON:    string // ICollocationPutAttributes
  }, {
    UserId:         string  // number
  }>, res: Response, next: NextFunction) {

    try {
      const { UserId } = req.query
      const { CollocationId, changesJSON } = req.body

      if (!UserId || !CollocationId) {
        next(ApiError.badRequest("Request error"))
      }

      const changes = JSON.parse(changesJSON)

      const result = CollocationService.edit({
        UserId: +UserId,
        CollocationId: +CollocationId,
        ...changes,
      })

      res.status(200).json({ data: result })
    } catch (error) {
      return next(ApiError.internal("CollocationController.put internal error: " + error))
    }

  }

}

export default CollocationController