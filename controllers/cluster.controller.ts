import { NextFunction, Request, Response } from "express";
import ApiError from "../error/ApiError"
import ClusterService from "../service/cluster.service";

class ClusterController {

  static async get(req: Request<{}, {}, {}, {
    UserId:               string // number
    LanguageId:           string // number
    acceptableLevels:     string // number[]
    onlyAvailableLevels:  string // boolean
  }>, res: Response, next: NextFunction) {

    try {
      const {
        UserId,
        LanguageId,
        acceptableLevels: strAcceptableLevels,
        onlyAvailableLevels: strOnlyAvailableLevels,
      } = req.query

      if (!UserId || !LanguageId) {
        next(ApiError.badRequest("Request error"))
      }

      const onlyAvailableLevels = JSON.parse(strOnlyAvailableLevels) as boolean
      const acceptableLevels    = JSON.parse(strAcceptableLevels) as number[]

      if (onlyAvailableLevels) {

        const result = await ClusterService.getAvailableLevels(+UserId, +LanguageId)
        res.status(200).json({ data: result })

      } else {

        const result = await ClusterService.getOne(+UserId, +LanguageId, acceptableLevels)

        if ((result as {error: string}).error) {
          next(ApiError.badRequest((result as {error: string}).error))
        }

        res.status(200).json({ data: result })

      }

    } catch (error) {
      return next(ApiError.internal("UserController.get internal error: " + error))
    }

  }

  static async put(req: Request<{}, {}, {
    ClusterId:  string // number
    changes:    string // IClusterPutOptions
  }, {
    UserId:         string  // number
  }>, res: Response, next: NextFunction) {
    const { ClusterId, changes: changesJSON } = req.body
    const { UserId } = req.query

    if (!UserId || !ClusterId) {
      next(ApiError.badRequest("Request error"))
    }

    const changes = JSON.parse(changesJSON)

    const result = await ClusterService.edit(+UserId, +ClusterId, changes)

    res.status(200).json({ data: result })
  }

}