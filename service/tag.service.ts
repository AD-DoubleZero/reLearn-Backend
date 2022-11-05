import { Op } from "sequelize"
import Collocation from "../models/collocation.model"
import Tag from "../models/tag.model"

class TagService {

  static async create(UserId: number, title: string) {
    const result = await Tag.create({
      UserId,
      title,
    })

    return result
  }

  static async delete(UserId: number, TagId: number) {

    const isDeleted = await Tag.destroy({
      where: {
        id: TagId,
        UserId
      }
    })

    if (!isDeleted) {
      return false
    }

    await Collocation.findAll({
      where: {
        tagsJSON: {
          [Op.like]: `%${TagId}%`
        }
      }
    })
      .then((res) => {
        res.forEach(async r => {
          let tags = JSON.parse(r.tagsJSON) as number[]

          tags = tags.filter(t => t !== TagId)

          if (tags.length === 0) {
            tags = [ 0 ]
          }

          r.tagsJSON = JSON.stringify(tags)
          await r.save()

          return true
        })
      })
  }

  static async getAll(UserId: number) {
    const result = await Tag.findAll({
      where: {
        UserId
      },
      raw: true
    })

    return result
  }

  static async getCertain(UserId: number, certainTagsId: number[]) {
    const result = await Tag.findAll({
      where: {
        UserId,
        id: {
          [Op.or]: certainTagsId.map(t => { return { [Op.in]: [t] } })
        },
      },
      raw: true,
    })

    return result
  }

}

export default TagService