import { BaseHandler, MessageHandler } from "./BaseHandler";
import { Commands } from "./Commands";
import { MessageUtil } from "../MessageUtil";

export class StopAudio extends BaseHandler implements MessageHandler {
  handleMessage(message: MessageUtil): void {
    // Allows for users to stop with either the command form or just saying stop
    if (message.contains(Commands.Stop) || message.commandIs(Commands.Stop)) {
      console.log("Stopping audio");
      this.util.stopAudio();
    }
  }
}
