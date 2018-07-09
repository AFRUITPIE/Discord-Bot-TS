import { Client, Message } from "discord.js";
import { Util } from "./util";
import { handlers as Handlers } from "./message-features";

export const loginData = require("../login.json");

let client = new Client();

// FIXME: Because of async issues, we probably want a new Util for EVERY channel for the bot.
let util: Util | undefined = undefined;

client.on("message", (message: Message) => {
  // Handles initializing Util
  if (!util) {
    if (loginData.firebase) {
      util = Util.getInstance(message, loginData.firebase);
    } else {
      util = Util.getInstance(message);
    }
  } else {
    if (!message.author.bot) {
      util.setMessage(message);
    }
  }

  // Go through all message handlers
  if (!message.author.bot) {
    Handlers.forEach(handlerClass => {
      let handler = new handlerClass();
      handler.handleMessage();
      handler = null; // FIXME: Release for garbage collection necessary?
    });
  }
});

client.login(loginData.token).then(() => {
  console.log("Successfully logged in");
});
