require("dotenv").config();
const { Bot, GrammyError, HttpError, Keyboard, InlineKeyboard } = require("grammy");

const bot = new Bot(process.env.BOT_TOKEN);

bot.api.setMyCommands([
  { command: "start", description: "Запуск бота" },
  { command: "mood", description: "Как ваше настроение?" },
  { command: "share", description: "Поделиться данными" },
  { command: "inline_keyboard", description: "Инлайн клавиатура" },
])

bot.command("inline_keyboard", async (ctx) => {
  const inlineKeyboard = new InlineKeyboard()
    .text("1", "button-1").row()
    .text("2", "button-2")
    .text("3", "button-3");

  await ctx.reply("Выберите цифру", {
    reply_markup: inlineKeyboard
  })
})

bot.command("start", async (ctx) => {
  ctx.react("❤‍🔥")
  await ctx.reply("Привет, Я - бот! ТГ канал: <a href='https:// https://t.me/+1fyCWj6yNpRkOGU6'>ссылка</a>", {
    reply_parameters: { message_id: ctx.msg.message_id }
  });
});

bot.callbackQuery(["button-1", "button-2", "button-3"], async (ctx) => {
  await ctx.answerCallbackQuery("Вы выбрали цифру");
  await ctx.reply("Вы отправили цифру");
})

bot.command("share", async (ctx) => {
  const shareKeyboard = new Keyboard().requestLocation("Геолокация").requestContact("Контакт").requestPoll("Опрос").resized().oneTime().placeholder("Укажи данные");

  await ctx.reply("Чем хочешь поделиться?", {
    reply_markup: shareKeyboard
  })
})

bot.on(":contact", async(ctx) => {
  await ctx.reply("Спасибо за контакты")
})

bot.command("mood", async (ctx) => {
  const moodKeyboard = new Keyboard().text("Хорошо").row().text("Норм").row().text("Плохо").resized().oneTime();
  await ctx.reply("Как настроение?", {
    reply_markup: moodKeyboard
  })
})

bot.command("mood", async (ctx) => {
  const moodLabesl = ["Хорошо", "Норм", "Плохо"];
  const rows = moodLabesl.map(label => {
    return [
      Keyboard.text(label)
    ]
  });

  const moodKeyboard = Keyboard.from(rows).resized().oneTime();

  await ctx.reply("Как настроение?", {
    reply_markup: moodKeyboard
  })
})


bot.hears("Хорошо", async (ctx) => {
  await ctx.reply("Класс!")
})

bot.command("help", async (ctx) => {
  await ctx.reply("Это справочное сообщение");
});

bot.command(["say_hello", "hello", "say_hi"], async (ctx) => {
  await ctx.reply("Hello!")
})

bot.hears("Пинг", async (ctx) => {
  await ctx.reply("Понг")
})

bot.hears(/пипец/, async (ctx) => {
  await ctx.reply("Ругаемся?")
})

bot.hears("ID", async (ctx) => {
  await ctx.reply(`Ваш ID: ${ctx.from.id}`)
})

bot.on("msg", async (ctx) => {
  console.log(ctx.msg)
  console.log(ctx.from)
})

bot.on(["::url", ":media"], async (ctx) => {
  await ctx.reply("Получил ссылку");
});

bot.on(":photo").on("::hashtag", async (ctx) => {
  await ctx.reply("Хэштэг с фото")
})

bot.on("msg").filter((ctx) => {
  return ctx.from.id === 892742071
}, async (ctx) => {
  await ctx.reply("Привет, админ")
})

bot.catch(err => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;

  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description)
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e)
  } else {
    console.error("Unknown error", e);
  }
})

bot.start();