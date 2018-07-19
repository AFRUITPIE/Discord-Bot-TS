import { Client, Message } from "discord.js";
import { Util } from "./util";
import { handlers as Handlers } from "./message-features";
import firebase from "firebase-admin";

// Login data for Firebase, Youtube, Discord, etc.
// See README for extra information on how to handle this
// FIXME: Possible to use an import rather than a require statement?
export const loginData = require("../login.json");

// Handles initializing the firebase application
let firebaseApp: firebase.app.App;
if (loginData) {
  if (loginData.firebaseDatabaseURL && loginData.firebaseToken) {
    try {
      firebase.initializeApp({
        credential: firebase.credential.cert(loginData.firebaseToken),
        databaseURL: loginData.firebaseDatabaseURL
      });
      console.log("Firebase app initialized");
    } catch (err) {
      console.error(err);
    }
  }
} else {
  console.log("No firebase login detected");
}

// client for the Bot itself
const client = new Client();

// FIXME: Because of async issues, we probably want a new Util for EVERY channel for the bot.
let util: Util | undefined = undefined;

// Goes through every message handler to see if it can interact with any of them
client.on("message", (message: Message) => {
  // Handles initializing Util
  if (!util) {
    Util.getInstance(message);
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
