import Cluster from "./cluster.model"
import Collocation from "./collocation.model"
import Language from "./language.model"
import Tag from "./tag.model"
import User from "./user.model"
import CandidateToCluster from "./сandidateToCluster.model"

const isDev = process.env.NODE_ENV === "development"

const sync = async () => {
  User.hasMany(Collocation)
  Collocation.belongsTo(User)

  User.hasMany(Cluster)
  Cluster.belongsTo(User)

  User.hasMany(Tag)
  Tag.belongsTo(User)

  Language.hasMany(Collocation)
  Collocation.belongsTo(Language)

  Language.hasMany(Cluster)
  Cluster.belongsTo(Language)

  Collocation.hasMany(CandidateToCluster)
  CandidateToCluster.belongsTo(Collocation)

  await User.sync({ alter: isDev })
  await Language.sync({ alter: isDev })
  await Collocation.sync({ alter: isDev })
  await CandidateToCluster.sync({ alter: isDev })
  await Cluster.sync({ alter: isDev })
  await Tag.sync({ alter: isDev })
}

export default sync