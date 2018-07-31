import { BaseHandler } from "./BaseHandler";
import { Commands } from "./Commands";

export class BotSay extends BaseHandler {
  handleMessage(): void {
    // Responds with exactly what the previous user said
    if (this.util.commandIs(Commands.BotSay) && this.util.isAdmin()) {
      let messageText: string = this.util.getMessageText(true);

      this.util
        .getMessage()
        .delete()
        .then(() => {
          this.util.sendToChannel(messageText);
        });
    }
  }
}
