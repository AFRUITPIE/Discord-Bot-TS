import { BaseHandler } from "./BaseHandler";
import { Commands } from "./Commands";

export class StopAudio extends BaseHandler {
  handleMessage(): void {
    // Allows for users to stop with either the command form or just saying stop
    if (this.util.messageContains(Commands.Stop) || this.util.commandIs(Commands.Stop)) {
      console.log("Stopping audio");
      this.util.stopAudio();
    }
  }
}
