import { Op, Sequelize } from "sequelize"
import Collocation from "../models/collocation.model"
import CandidateToCluster from "../models/сandidateToCluster.model"
import UserService from "./user.service"


class CollocationService {
  static async create(props: { UserId: number, LanguageId: number, body: string }) {
    const collocation = await Collocation.create(props)
    await this.createCandidate(collocation.id)

    const user = await UserService.findOne(props.UserId)

    user.addedCount += 1
    await user.save()

    return collocation
  }

  static async edit (props: {
    UserId:         number
    CollocationId:  number
    body:           string
    meaning:        string
    association:    string
    transription:   string
    lastRepeat:     Date
    examples:       string[]
    tags:           number[]
  }) {

    const {
      UserId,
      CollocationId,
      examples,
      tags,
      ...changes
    } = props

    const examplesJSON  = JSON.stringify(examples)
    const tagsJSON      = JSON.stringify(tags)

    const result = Boolean(
      await Collocation.update({
        examplesJSON,
        tagsJSON,
        ...changes
      }, {
        where: {
          UserId,
          id: CollocationId,
        },
        returning: true
      })
    )

    return result
  }

  static async add(props: { UserId: number, LanguageId: number, body: string }) {
    const {
      UserId,
      LanguageId,
      body,
    } = props

    if (!await UserService.checkAbleToCreate(UserId)) {
      return "Превышен лимит по словам на аккаунте." as string
    }

    const candidate = await this.findOne({UserId, LanguageId, body})

    if (!candidate) {
      return {
        collocation: await this.create(props),
        type: "COLLOCATION_CREATE"
      }
    }

    const candidateToCluster = await this.findCandidate(candidate.id)

    if (!candidateToCluster) {
      await this.createCandidate(candidate.id)

      return {
        collocation: candidate,
        type: "CANDIDATE_CREATE"
      }
    }

    if (candidateToCluster.isPriority) {
      return "Слово существует и уже имеет максимальный приоритет на попадание в набор." as string
    }

    candidateToCluster.isPriority = true
    await candidateToCluster.save()

    return {
      collocation: candidate,
      type: "CANDIDATE_PRIORITIZE"
    }
  }

  static parseQueriesToFind (props: {
    UserId?:     string,
    LanguageId?: string,
    body?:      string,
    sorting?:   string,
    tags?:      string,
    page?:      string,
    limit?:     string,
  }) {
    const result = {
      UserId: +props.UserId,
      LanguageId: +props.LanguageId,
      body: props.body,
      sorting: props.sorting,
      tags: JSON.parse(props.tags) as number[],
      page: +props.page,
      limit: +props.limit,
    }

    return result
  }

  static async find(props: {
    UserId: number
    LanguageId?: number
    body?: string
    limit?: number
    page?: number
    tags?: number[]
    sorting?: string
  }) {
    const {
      UserId,
      LanguageId,
      body,
      tags,
      sorting,
      limit,
      page,
    } = props

    // const bodyParam = body.toLowerCase() || ""

    const options: any = {
      where: {
        UserId,
        LanguageId,
        // [Op.or]: [
        //   Sequelize.where(
        //     Sequelize.fn('lower', Sequelize.col('body')),
        //     {
        //       [Op.like]: `%${bodyParam}%`
        //     }
        //   ),
        //   Sequelize.where(
        //     Sequelize.fn('lower', Sequelize.col('meaning')),
        //     {
        //       [Op.like]: `%${bodyParam}%`
        //     }
        //   )
        // ]
      }
    }

    if ( body ) {
      const param = [
        Sequelize.where(
          Sequelize.fn('lower', Sequelize.col('body')),
          {
            [Op.like]: `%${body.toLowerCase()}%`
          }
        ),
        Sequelize.where(
          Sequelize.fn('lower', Sequelize.col('meaning')),
          {
            [Op.like]: `%${body.toLowerCase()}%`
          }
        )
      ]

      options.where[Op.or] = param
    }

    if ( tags && tags.length ) {
      const param =  {
        [Op.or]: tags.map(t => { return { [Op.like]: `%${t}%` } })
      }

      options.where.tagsJSON = param
    }

    if ( sorting ) {
      let param: [
        "createdAt" | "body",
        "DESC" | "ASC"
      ]

      switch (sorting) {
        case "DATE_DESC":
          param = ["createdAt", "DESC"]
          break;

        case "DATE_ASC":
          param = ["createdAt", "ASC"]
          break;

        case "BODY_DESC":
          param = ["body", "DESC"]
          break;

        case "BODY_ASC":
        default:
          param = ["body", "ASC"]
          break;
      }

      options.sorting = param
    }

    limit && Object.assign(options, { limit })

    if ( page && limit ) {
      const offset = page * limit - limit
      Object.assign(options, { offset })
    }

    return await Collocation.findAndCountAll(options)
  }

  static async findOne(props: { UserId: number, LanguageId: number, body: string }) {
    return await Collocation.findOne({
      where: props
    })
  }

  static async findCandidate(CollocationId: number) {
    return await CandidateToCluster.findOne({
      where: {
        CollocationId
      }
    })
  }

  static async createCandidate(CollocationId: number) {
    return await CandidateToCluster.create({ CollocationId })
  }
}

export default CollocationService