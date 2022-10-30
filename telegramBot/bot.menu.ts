import { InlineKeyboardButton, SendMessageOptions } from "node-telegram-bot-api";
import { ADDRESS } from "../utils/consts";

const learn: InlineKeyboardButton = { text: "Начать повторять", web_app: { url: ADDRESS + "learn" } }
const dictionary: InlineKeyboardButton = { text: "Словарь", web_app: { url: ADDRESS + "dictionary" } }
const add: InlineKeyboardButton = { text: "Добавить", callback_data: "/add" }
const profile: InlineKeyboardButton = { text: "Профиль", callback_data: "/profile" }
const help: InlineKeyboardButton = { text: "Как и что делать?", callback_data: "/help" }
const about: InlineKeyboardButton = { text: "О боте", callback_data: "/about" }

export const botMenu: SendMessageOptions = {
  reply_markup: {
    inline_keyboard: [
      [ learn ],
      [ add ],
      [ dictionary, profile ],
      [ help ],
      [ about ],
    ],
  }
}
