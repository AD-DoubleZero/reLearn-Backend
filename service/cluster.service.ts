import { Op } from "sequelize"
import Cluster, { IClusterPutOptions } from "../models/cluster.model"
import Collocation from "../models/collocation.model"
import CandidateToCluster from "../models/сandidateToCluster.model"

class ClusterService {

  static async create(UserId: number, LanguageId: number, allowToCreate: boolean) {

    if (!allowToCreate) {
      return
    }

    const candidates = await CandidateToCluster.findAll(
      {
        include: {
          model: Collocation,
          where: {
            UserId,
            LanguageId,
          }
        },
        limit: 5,
        order: [
          ["isPriority", "DESC"]
        ],
      }
    ) as CandidateToCluster[]

    const candidatesIds = candidates.map(c => c.id)

    // User has 5 free words
    if (candidates.length >= 5) {
      const cluster = await Cluster.create({
        collocationsJSON: JSON.stringify(candidatesIds),
        UserId,
        LanguageId,
      }, {
        raw: true
      })

      await CandidateToCluster.destroy({
        where: {
          id: {
            [Op.or]: candidatesIds.map((c) => {
              return {[Op.in]: [c]}
            })
          }
        }
      })

      const collocations = await Collocation.findAll({
        where: {
          id: {
            [Op.or]: candidatesIds.map((c) => {
              return {[Op.in]: [c]}
            })
          }
        },
        raw: true
      })

      return {
        cluster,
        collocations,
      }
    }

  }

  static async edit(UserId: number, ClusterId: number, changes: IClusterPutOptions) {
    const result = Boolean(
      await Cluster.update(changes, {
        where: {
          id: ClusterId,
          UserId
        }
      })
    )

    return result
  }

  static async getOne(UserId: number, LanguageId: number, acceptableLevels: number[]) {
    const allowToCreate = acceptableLevels.includes(0)

    const created = this.create(UserId, LanguageId, allowToCreate)

    if (created) {
      return created
    }

    const finded = await Cluster.findOne({
      where: {
        LanguageId,
        UserId,
        level: {
          [Op.or]: acceptableLevels.map((l) => {
            return {[Op.in]: [l]}
          })
        }
      },
      order: [
        ["repeatCount", "ASC"],
        ["isReadyForMerge", "ASC"],
        ["isSaved", "ASC"],
      ],
      raw: true
    })

    if (!finded) {
      return { error: "По указанным параметрам невозможно получить кластер. Попробуйте добавить больше слов в словарь или изменить условия поиска" }
    }

    const collocationsId = JSON.parse(finded.collocationsJSON) as number[]

    // If a cluster is found, search for its words
    const collocations = await Collocation.findAll({
      where: {
        id: {
          [Op.or]: collocationsId.map(c => {
            return {[Op.in]: [c]}
          })
        },
        LanguageId,
        UserId,
      },
      raw: true,
    })

    return {
      cluster: finded,
      collocations,
    }
  }

  static async getAvailableLevels(UserId: number, LanguageId?: number) {
    const where: {
      UserId: number,
      LanguageId?: number
    } = {
      UserId
    }

    if (LanguageId) {
      where.LanguageId = LanguageId
    }

    const clusterLevels = await Cluster.findAll({
      where,
      attributes: ["level"],
      raw: true
    }) as Pick<Cluster, "level">[]

    const result: {
      level: number
      count: number
    }[] = []

    clusterLevels.forEach((current) => {
      const candidate = result.find(item => item.level === current.level)

      if (candidate) {
        candidate.count += 1
      } else {
        result.push({
          level: current.level,
          count: 1,
        })
      }
    })

    return result
  }

}

export default ClusterService