import Language from "../models/language.model";

class LanguageService {
  static async findOne (id: number) {
    return await Language.findByPk(id)
  }

  static async findAll () {
    return await Language.findAll()
  }
}

export default LanguageService