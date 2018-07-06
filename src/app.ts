import { Client, Message } from "discord.js";
import { Util } from "./util";
import { PingPong } from "./message-features/PingPong";

let client = new Client();
let util: Util | undefined = undefined; // FIXME: nullable version of this?

client.on("message", (message: Message) => {
  if (!util) {
    util = Util.getInstance(message);
  } else {
    util.setMessage(message);
  }
  new PingPong().handleMessage;

  // TODO: Go through all different message handlers
});

//TODO: Parse login information from a json
client.login("TOKEN HERE");
