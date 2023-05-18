import { Telegraf } from 'telegraf';
import { axios } from 'axios';
import { message } from 'telegraf/filters';
import dotenv from 'dotenv';
dotenv.config();

const regex_link = /\["(https:\/\/lh3\.googleusercontent\.com\/[a-zA-Z0-9\-_]*)"/g
const regex_link_photos = /\bhttps?:\/\/photos\.app\.goo\.gl\/[a-zA-Z0-9\-_]\S+/gi
const regex_album_name = /<title>(.*?)<\/title>/

const bot = new Telegraf(process.env.BOT_TOKEN);
var branca = 'EG'

function extract_link(content) {
  if (content.match(regex_link_photos) != null) {
    return content.match(regex_link_photos)[0];
  } else {
    return "err";
  }

}

function extract_album_name(content) {
  return regex_album_name.exec(content)[1].replace(" - Google Photos", "")
}

function extract_photos(content) {
  const links = new Set()
  let match
  while (match = regex_link.exec(content)) {
    links.add(match[1])
  }
  return Array.from(links)
}

async function getAlbum(link_album) {
  const objectDate = new Date();
  let day = objectDate.getDate();
  let month = objectDate.getMonth() + 1;
  let year = objectDate.getFullYear();
  
  let formatDate = day + '/' + month + '/' + year
  console.log(formatDate);

  try {
    const response = await axios.get(link_album)
    const photos = extract_photos(response.data)

    return {
      "id": "INCREMENT",
      "name": extract_album_name(response.data),
      "branca": branca,
      "date": formatDate,
      "place": "Villasanta (MB)",
      "album_link": link_album,
      "album_cover": photos[0],
    }

  } catch (err) {
    console.log(err);
    return {
      "id": err
    }
  }
}

bot.command('quit', async (ctx) => {
  await ctx.telegram.leaveChat(ctx.message.chat.id);
  await ctx.leaveChat();
});

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


bot.on(message('text'), async (ctx) => {
  let link = extract_link(ctx.message.text);

  if (link == 'err') {
    // NOTE: console.log(link);
    await ctx.reply(`not url`);
  } else {
    let album = await getAlbum(link)
    album.id != "INCREMENT" ?
      await ctx.reply("error") :
      axios.post('https://sheetdb.io/api/v1/szlv36k1mncvl', album)
      .then(async (response) => ctx.reply(response.status.toString()))
      .catch(async (err) => ctx.reply("- fuck -"));
  }
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
