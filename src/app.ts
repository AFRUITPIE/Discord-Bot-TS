import { Message, Client } from "discord.js";
import { ChannelUtil } from "./declarations/ChannelUtil";
import firebase from "firebase-admin";
import { CreateLogin, LoginData } from "./createLogin";
import { MessageHandler } from "./message-features/BaseHandler";
import Handlers from "./message-features";
import "./declarations/MessageDeclaration";

// Login data for Firebase, Youtube, Discord, etc.
// See README for extra information on how to handle this
// FIXME: Possible to use an import rather than a require statement?

export let loginData: LoginData;

console.log("If there is difficulty logging in, delete login.json to run the login process again.");

// Load or create a login
try {
  loginData = require("../login.json");
} catch (err) {
  loginData = new CreateLogin().run();
}

// Handles initializing the firebase application
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
} else {
  console.log("No firebase login detected");
}

// Istantiate all message handlers
const messageHandlers: MessageHandler[] = [];
Handlers.forEach(handler => {
  messageHandlers.push(new handler());
});

// client for the Bot itself
const client = new Client();

// FIXME: Because of async issues, we probably want a new Util for EVERY channel for the bot.
let util: ChannelUtil | undefined = undefined;

// Goes through every message handler to see if it can interact with any of them
client.on("message", (message: Message) => {
  // const messageUtil = new MessageUtil(message);

  // Handles initializing Util
  if (!util) {
    util = ChannelUtil.getInstance();
  }

  if (!message.author.bot) {
    util.setMessage(message);
  }

  // Go through all message handlers
  if (!message.author.bot) {
    messageHandlers.forEach((handler: MessageHandler) => {
      handler.handleMessage(message);
    });
  }
});

client.login(loginData.token).then(() => {
  console.log(`Successfully logged into Discord as ${client.user?.username}`);
});
