import UserService from "../service/user.service";
import { bot } from ".";
import { COLLOCATION_ACCOUNT_LIMIT } from "../utils/consts";
import { botMenu } from "./bot.menu";
import CollocationService from "../service/collocation.service";
import { collocationAddConfirm, collocationDeny } from "./bot.options";
import LanguageService from "../service/language.service";
import { SendMessageOptions } from "node-telegram-bot-api";
import ClusterService from "../service/cluster.service";

class BotMethods {
  static async start(id: number, username: string) {
    await UserService.create(id, username)

    const text = `!!!Бот находится на стадии разработки!!! Его функционал может быть полностью или частично нерабочим. Если вы заинтересованы ботом, вы можете вернуться позже или дождаться рассылки с уведомлением о конце разработки.${"\n"}Здравствуйте, ${username}, я ваш помощник по увеличению словарного запаса!${"\n"}Меня создали с целью запоминания слов английского языка, однако мой потенциал оказался куда выше!${"\n"}Моя работа — запоминать слова по категориям и показывать их в мини-игре. Больше информации вы можете найти нажав на кнопку «О боте».`

    return await bot.sendMessage(id, text, botMenu)
  }

  static async profile(id: number) {
    const { isFullAccess, addedCount, repeatCount } = await UserService.findOne(id)
    const clustersInfo = await ClusterService.getAvailableLevels(id)

    const isFullAccessText = isFullAccess ? "У вас полный доступ! Ваш аккаунт не имеет ограничений!" : `К сожалению, ваш аккаунт имеет ограниченный доступ. Вы не можете иметь больше ${COLLOCATION_ACCOUNT_LIMIT} слов или словосочетаний на аккаунте.`

    const countsText = `Слов добавлено: ${addedCount}.${"\n"}Количество повторений слов: ${repeatCount}.`

    const clustersStringified = clustersInfo.map(c => `Уровень ${c.level}: ${c.count}`).join("\n")
    const clustersInfoText = clustersInfo.length ? `Количество наборов по уровням на аккаунте:${"\n"}${clustersStringified}` : "У вас еще нет ни одного набора."

    const text = isFullAccessText + "\n\n" + countsText + "\n\n" + clustersInfoText

    return await bot.sendMessage(id, text, botMenu)
  }

  static async help(id: number) {
    const text = `Заглушка`

    return await bot.sendMessage(id, text, botMenu)
  }

  static async about(id: number) {
    const text = `Заглушка`

    return await bot.sendMessage(id, text, botMenu)
  }

  static async suggestToChangeLanguage(id: number) {
    const languages = await LanguageService.findAll()

    const text = `Выберите каталог`

    const languagesMaped = languages.map(l => {
      return { text: l.title, callback_data: `/lng_${l.id}` }
    })

    const arraySize = 3

    const keyboard = []

    for (let i = 0; i < languagesMaped.length; i += arraySize) {
      keyboard.push(languagesMaped.slice(i, i + arraySize))
    }

    const options: SendMessageOptions = {
      reply_markup: {
        inline_keyboard: keyboard,
      }
    }

    return await bot.sendMessage(id, text, options)
  }

  static async changeUserLanguage(id: number, LanguageId: number) {
    await UserService.edit(id, { lastSelectedLanguage: LanguageId })

    const { title } = await LanguageService.findOne(LanguageId)

    const text = `Вы успешно изменили текущий каталог на «${title}». Добавить слово в этот каталог?`
    return await bot.sendMessage(id, text, collocationAddConfirm)
  }

  static async addCollocation(id: number, body: string) {
    const language = await UserService.getLanguage(id)

    const result = await CollocationService.add({
      UserId: id,
      LanguageId: language.id,
      body
    })

    if (typeof result === "object") {
      const { collocation, type } = result
      let text = ""
      switch (type) {
        case "COLLOCATION_CREATE":
          text = `Вы успешно добавили «${collocation.body}» в словарь категории ${language.title}!`
          break;

        case "CANDIDATE_CREATE":
          text = `Теперь «${collocation.body}» имеет шанс попасть в новый набор категории ${language.title}!`
          break;

        case "CANDIDATE_PRIORITIZE":
          text = `Теперь «${collocation.body}» имеет приоритет при попадании в набор категории ${language.title}!`
          break;

        default:
          break;
      }
      return await bot.sendMessage(id, text, botMenu)
    } else {
      const text = `Неудача! ${result}`
      return await bot.sendMessage(id, text, botMenu)
    }
  }

  static async deny(id: number) {
    const text = `Вы отменили действие.`
    return await bot.sendMessage(id, text, botMenu)
  }

  static async tryAddCollocation(id: number, body: string) {
    const language = await UserService.getLanguage(id)
    const candidate = await CollocationService.findOne({
      UserId: id,
      LanguageId: language.id,
      body
    })

    if (!candidate) {
      const text = `Добавить «${body}» в каталог ${language.title}? Вы не сможете удалить это слово после добавления.`

      return await bot.sendMessage(id, text, collocationAddConfirm)
    }

    const candidateToCluster = await CollocationService.findCandidate(candidate.id)

    if (!candidateToCluster) {
      const text = `«${body}» уже есть в каталоге ${language.title}, но не находится в очереди на добавление в новый набор. Позволить слову встать в очередь в новый набор?`

      return await bot.sendMessage(id, text, collocationAddConfirm)
    }

    if (!candidateToCluster.isPriority) {
      const text = `«${body}» уже есть в каталоге ${language.title} и стоит в очереди на добавление в новый набор. Дать слову приоритет?`

      return await bot.sendMessage(id, text, collocationAddConfirm)
    }

    const text = `«${body}» уже есть в каталоге ${language.title}, стоит в очереди на добавление и имеет приоритет.`

    return await bot.sendMessage(id, text, botMenu)
  }

  static async startWaitingForCollocation(id: number) {
    const text = `Напишите в чат боту слово или словосочетание, которое хотите добавить.`
    return await bot.sendMessage(id, text, collocationDeny)
  }

  static async error(id: number) {
    const text = `Произошла ошибка.`
    return await bot.sendMessage(id, text, botMenu)
  }
}

export default BotMethods