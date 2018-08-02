import { BaseHandler, MessageHandler } from "./BaseHandler";
import { Commands } from "./Commands";
import { Message } from "discord.js";

export class BotSay extends BaseHandler implements MessageHandler {
  handleMessage(message: Message): void {
    // Responds with exactly what the previous user said
    if (message.commandIs(Commands.BotSay) && message.isAdmin()) {
      let messageText: string = message.toString(true);

      message.delete().then(() => {
        message.sendToChannel(messageText);
      });
    }
  }
}
