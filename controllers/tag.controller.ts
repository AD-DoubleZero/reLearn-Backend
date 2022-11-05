import { NextFunction, Request, Response } from "express";
import ApiError from "../error/ApiError";
import TagService from "../service/tag.service";

class TagController {

  static async get(req: Request<{}, {}, {}, {
    UserId:   string // number
    options:  string // { certainTagsId?: number[] }
  }>, res: Response, next: NextFunction) {

    try {

      const { UserId, options: strOptions } = req.query

      const options = JSON.parse(strOptions) as { certainTagsId?: number[] }

      const { certainTagsId } = options

      if (certainTagsId) {
        const result = await TagService.getCertain(+UserId, certainTagsId)
        res.status(200).json({ data: result })
      } else {
        const result = await TagService.getAll(+UserId)
        res.status(200).json({ data: result })
      }

    } catch (error) {

      return next(ApiError.internal("UserController.get internal error: " + error))

    }

  }

  static async post(req: Request<{}, {}, {
    title: string
  }, {
    UserId: string // number
  }>, res: Response, next: NextFunction) {

    try {
      const { UserId } = req.query
      const { title } = req.body

      const result = await TagService.create(+UserId, title)

      res.status(200).json({ data: result })
    } catch (error) {

      return next(ApiError.internal("UserController.get internal error: " + error))

    }

  }

  static async delete(req: Request<{}, {}, {
    TagId: string // number
  }, {
    UserId: string // number
  }>, res: Response, next: NextFunction) {

    try {
      const { TagId } = req.body
      const { UserId } = req.query

      const result = await TagService.delete(+UserId, +TagId)

      res.status(200).json({ data: result })
    } catch (error) {

      return next(ApiError.internal("UserController.get internal error: " + error))

    }

  }

}

export default TagController