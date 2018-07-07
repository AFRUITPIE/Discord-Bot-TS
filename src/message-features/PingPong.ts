import { BaseHandler } from "./BaseHandler";

enum Keywords {
  trigger = "ping",
  response = "Pong!"
}

export class PingPong extends BaseHandler {
  handleMessage(): void {
    if (this.util.messageEquals(Keywords.trigger)) {
      this.util.sendToChannel(Keywords.response);
      console.log(`Responding ${Keywords.response} because user said ${Keywords.trigger}`);
    }
  }
}
