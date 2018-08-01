import { BaseHandler, MessageHandler } from "./BaseHandler";
import { Commands } from "./Commands";
import { MessageUtil } from "../MessageUtil";

export class LockChannel extends BaseHandler implements MessageHandler {
  handleMessage(message: MessageUtil): void {
    if (message.commandIs(Commands.LockChannel)) {
      this.util.toggleChannelLock();
    }
  }
}
