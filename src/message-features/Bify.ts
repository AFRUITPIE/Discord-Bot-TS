import { BaseHandler, MessageHandler } from "./BaseHandler";
import { Commands } from "./Commands";
import { Message } from "discord.js";

export class Bify extends BaseHandler implements MessageHandler {
  handleMessage(message: Message): void {
    if (message.commandIs(Commands.Bify)) {
      let trashMessage = message.toString(true).replace(/[Bb]/g, "🅱️");
      message.delete();
      message.sendToChannel(trashMessage);
    }
  }
}
