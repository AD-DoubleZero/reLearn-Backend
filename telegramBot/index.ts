import TelegramApi from "node-telegram-bot-api"
import BotMethods from "./bot.methods"

const token = process.env.BOT_API_TOKEN

export const bot = new TelegramApi(token, { polling: true })

const collocationsToAdd: {[propName: number]: string} = {}
const lastMessages: {[propName: number]: number} = {}

const rememberLastMessage = async (UserId: number, message: TelegramApi.Message) => {
  const { message_id } = message
  lastMessages[UserId] = message_id
}

const botStart = () => {
  bot.on("message", async msg => {
    const text = msg.text
    const UserId = msg.chat.id

    if (lastMessages[UserId]) {
      await bot.editMessageReplyMarkup({
        inline_keyboard: []
      }, {
        chat_id: UserId,
        message_id: lastMessages[UserId]
      })
      delete lastMessages[UserId]
    }

    switch (text) {
      // the user activated the bot
      case "/start":
        const username = msg.chat.username || ""
        return rememberLastMessage(UserId, await BotMethods.start(UserId, username))

      // the user sent the bot a text
      default:
        collocationsToAdd[UserId] = text
        return rememberLastMessage(UserId,  await BotMethods.tryAddCollocation(UserId, text))
    }
  })

  bot.on("callback_query", async msg => {
    const data = msg.data

    const UserId = msg.message.chat.id

    await bot.editMessageReplyMarkup({
      inline_keyboard: []
    }, {
      chat_id: UserId,
      message_id: msg.message.message_id
    })

    switch (data) {
      // returns users stats
      case "/profile":
        return rememberLastMessage(UserId,  await BotMethods.profile(UserId))

      case "/add":
        return rememberLastMessage(UserId,  await BotMethods.startWaitingForCollocation(UserId))

      // returns info about how to use bot
      case "/help":
        return rememberLastMessage(UserId,  await BotMethods.help(UserId))

      // returns info about bot and its creator
      case "/about":
        return rememberLastMessage(UserId,  await BotMethods.about(UserId))

      // returns a list of available languages
      case "/change_language":
        return rememberLastMessage(UserId,  await BotMethods.suggestToChangeLanguage(UserId))

      // confirmation of adding a collocation
      case "/confirm":
        if (collocationsToAdd[UserId]) {
          const body = collocationsToAdd[UserId]
          delete collocationsToAdd[UserId]
          return rememberLastMessage(UserId,  await BotMethods.addCollocation(UserId, body))
        } else {
          return rememberLastMessage(UserId,  await BotMethods.error(UserId))
        }

      case "/deny":
        return rememberLastMessage(UserId,  await BotMethods.deny(UserId))

      default:
        if (data.startsWith("/lng_")) {
          const LanguageId = data.split("_").pop()
          return rememberLastMessage(UserId,  await BotMethods.changeUserLanguage(UserId, +LanguageId))
        }
        break
    }
  })
}

export default botStart