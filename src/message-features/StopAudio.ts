import { BaseHandler } from "./BaseHandler";
import { Commands } from "./Commands";

export class StopAudio extends BaseHandler {
  handleMessage(): void {
    if (this.util.messageContains(Commands.Stop)) {
      this.util.stopAudio();
    }
  }
}
