import { BaseHandler, MessageHandler } from "./BaseHandler";
import { Commands } from "./Commands";
import { Message } from "discord.js";

export class StopAudio extends BaseHandler implements MessageHandler {
  handleMessage(message: Message): void {
    // Allows for users to stop with either the command form or just saying stop
    if (message.contains(Commands.Stop) || message.commandIs(Commands.Stop)) {
      console.log("Stopping audio");
      this.util.stopAudio();
    }
  }
}
