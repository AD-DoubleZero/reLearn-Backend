import { Request, Response } from "express";

class CollocationController {
  add(req: Request<{}, {}, {
    UserId: number
  }>, res: Response) {
    req.body.UserId
  }
}