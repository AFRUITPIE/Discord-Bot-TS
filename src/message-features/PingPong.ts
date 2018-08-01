import { BaseHandler, MessageHandler } from "./BaseHandler";
import { MessageUtil } from "../MessageUtil";

enum Keywords {
  trigger = "ping",
  response = "Pong!"
}

export class PingPong extends BaseHandler implements MessageHandler {
  handleMessage(message: MessageUtil): void {
    if (message.toString() === Keywords.trigger) {
      message.sendToChannel(Keywords.response);
      console.log(`Responding ${Keywords.response} because user said ${Keywords.trigger}`);
    }
  }
}
