import Cluster from "../models/cluster.model"

class ClusterService {
  static async getAvailableLevels(id: number, LanguageId?: number) {
    const where: {
      UserId: number,
      LanguageId?: number
    } = {
      UserId: id
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