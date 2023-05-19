import { Telegraf } from 'telegraf';
//import { axios } from 'axios';
import { message } from 'telegraf/filters';
import dotenv from 'dotenv';
dotenv.config();

const regex_link = /\["(https:\/\/lh3\.googleusercontent\.com\/[a-zA-Z0-9\-_]*)"/g
const regex_link_photos = /\bhttps?:\/\/photos\.app\.goo\.gl\/[a-zA-Z0-9\-_]\S+/gi
const regex_album_name = /<title>(.*?)<\/title>/

const bot = new Telegraf(process.env.BOT_TOKEN);
var branca = 'EG'

bot.command('branca', (ctx) => {
  console.log(ctx.message.text.replace("/branca ", ""))
  switch (ctx.message.text.replace("/branca ","").toUpperCase()) {
    case "EG":
      branca = "EG"
      break;

    case "LC":
      branca = "LC"
      break;

    case "RS":
      branca = "RS"
      break;

    case "COCA":
      branca = "COCA"
      break;

    default:
      break;
  }  

  ctx.reply("branca → " + branca);
});


// bot.launch();
// process.once('SIGINT', () => bot.stop('SIGINT'));
// process.once('SIGTERM', () => bot.stop('SIGTERM'));

// -------------------------------------------------------
// function 

exports.handler = async event => {
  try {
    await bot.handleUpdate(JSON.parse(event.body))
    return { statusCode: 200, body: "" }
  } catch (e) {
    console.error("error in handler:", e)
    return { statusCode: 400, body: "This endpoint is meant for bot and telegram communication" }
  }
}
