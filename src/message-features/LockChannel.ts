import { BaseHandler } from "./BaseHandler";
import { Commands } from "./Commands";

export class LockChannel extends BaseHandler {
  handleMessage(): void {
    if (this.util.commandIs(Commands.LockChannel)) {
      this.util.toggleChannelLock();
    }
  }
}
