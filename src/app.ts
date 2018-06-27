import { Client, Message } from "discord.js";

let client = new Client();

client.on("message", (message: Message) => {
  // TODO: Go through all different message handlers
});

//TODO: Parse login information from a json
client.login("TOKEN HERE");
