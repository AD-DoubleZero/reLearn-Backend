import { InlineKeyboardButton, SendMessageOptions } from "node-telegram-bot-api";

const confirm: InlineKeyboardButton = { text: "Да", callback_data: "/confirm" }
const deny: InlineKeyboardButton = { text: "Отмена", callback_data: "/deny" }
const changeLanguage: InlineKeyboardButton = { text: "Другая категория", callback_data: "/change_language" }

export const collocationAddConfirm: SendMessageOptions = {
  reply_markup: {
    inline_keyboard: [
      [ confirm, deny ],
      [ changeLanguage ],
    ],
  }
}

export const collocationDeny: SendMessageOptions = {
  reply_markup: {
    inline_keyboard: [
      [ deny ],
    ],
  }
}
