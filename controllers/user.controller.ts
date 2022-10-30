import { NextFunction, Request, Response } from "express";
import ApiError from "../error/ApiError";
import { UserPutAttributes } from "../models/user.model";
import UserService from "../service/user.service";

class UserController {
  static async get(req: Request<{}, {}, {}, {id: string}>, res: Response, next: NextFunction) {
    try {
      const { id } = req.query
      const user = await UserService.findOne(+id)
      res.status(200).json({ user })
    } catch (error) {
      return next(ApiError.internal("UserController.get internal error:" + error))
    }
  }

  static async put(req: Request<{}, {}, {id: number, changes: UserPutAttributes}>, res: Response) {
    
  }
}

export default UserController