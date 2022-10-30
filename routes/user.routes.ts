import { Router } from "express";
import UserController from "../controllers/user.controller";

const userRouter = Router()

userRouter.route("/")
  .get(UserController.get)
  .put(UserController.put)

export default userRouter