import { BaseHandler, MessageHandler } from "./BaseHandler";
import { Commands } from "./Commands";
import { MessageUtil } from "../MessageUtil";

export class BotSay extends BaseHandler implements MessageHandler {
  handleMessage(message: MessageUtil): void {
    // Responds with exactly what the previous user said
    if (message.commandIs(Commands.BotSay) && message.isAdmin()) {
      let messageText: string = message.toString(true);

      message.delete().then(() => {
        message.sendToChannel(messageText);
      });
    }
  }
}
