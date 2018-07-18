import { Client, Message } from "discord.js";
import { Util } from "./util";
import { handlers as Handlers } from "./message-features";
import firebase from "firebase-admin";

export const loginData = require("../login.json");
const client = new Client();

let firebaseApp: firebase.app.App;

if (loginData) {
  if (loginData.firebaseURL && loginData.firebaseToken) {
    try {
      firebaseApp = firebase.initializeApp(loginData.firebase, loginData.firebaseURL);
      console.log("Successfully initialized Firebase application");
    } catch (err) {
      console.error(err);
    }
  }
} else {
  console.log("No firebase login detected");
}

// FIXME: Because of async issues, we probably want a new Util for EVERY channel for the bot.
let util: Util | undefined = undefined;

client.on("message", (message: Message) => {
  // Handles initializing Util
  if (!util) {
    Util.getInstance(message, firebaseApp);
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
  console.log(`Successfully logged into Discord as ${client.user.username}`);
});
