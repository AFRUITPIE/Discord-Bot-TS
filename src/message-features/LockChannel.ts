import { BaseHandler, MessageHandler } from "./BaseHandler";
import { Message } from "discord.js";
import { Commands } from "./Commands";

export class LockChannel extends BaseHandler implements MessageHandler {
  handleMessage(message: Message): void {
    if (message.commandIs(Commands.LockChannel)) {
      this.util.toggleChannelLock();
    }
  }
}
