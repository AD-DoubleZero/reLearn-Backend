import { NextFunction, Request, Response } from "express";
import ApiError from "../error/ApiError";
import { IUserPutAttributes } from "../models/user.model";
import UserService from "../service/user.service";

class UserController {

  static async get(req: Request<{}, {}, {}, {
    UserId: string // number
  }>, res: Response, next: NextFunction) {

    try {
      const { UserId } = req.query

      const user = await UserService.findOne(+UserId)
      res.status(200).json({ data: user })
    } catch (error) {
      return next(ApiError.internal("UserController.get internal error: " + error))
    }

  }

  static async put(req: Request<{}, {}, {
    changes: IUserPutAttributes // all ok
  }, {
    UserId: string // number
  }>, res: Response, next: NextFunction) {

    try {
      const { UserId } = req.query
      const { changes } = req.body

      const result = Boolean(await UserService.edit(+UserId, changes))

      res.status(200).json({ data: result })
    } catch (error) {
      return next(ApiError.internal("UserController.put internal error: " + error))
    }

  }

}

export default UserController