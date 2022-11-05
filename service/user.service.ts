import User from "../models/user.model";
import { COLLOCATION_ACCOUNT_LIMIT } from "../utils/consts";
import CollocationService from "./collocation.service";
import LanguageService from "./language.service";

class UserService {
  static async findOne(id: number) {
    return await User.findByPk(id)
  }

  static async create(id: number, username: string) {
    const candidate = await this.findOne(id)

    if (candidate) {

      if (candidate.username !== username) {
        return await this.edit(id, { username })
      }

      return candidate
    }

    return await User.create({id, username})
  }

  static async edit(id: number, options: Partial<Pick<User, "username" | "lastSelectedLanguage" | "isFullAccess" | "addedCount" | "repeatCount">>) {
    const user = await User.update(options, {
      where: {
        id
      },
      returning: true
    })

    return user[1][0]
  }

  static async getLanguage(id: number) {
    const LanguageId = (await this.findOne(id)).lastSelectedLanguage || 1

    return await LanguageService.findOne(LanguageId)
  }

  static async checkAbleToCreate(id: number) {
    const { isFullAccess } = await this.findOne(id)

    if (isFullAccess) {
      return true
    }

    const collocations = await CollocationService.find({ UserId: id, limit: COLLOCATION_ACCOUNT_LIMIT })

    if (collocations.rows.length < COLLOCATION_ACCOUNT_LIMIT) {
      return true
    }

    return false
  }
}

export default UserService