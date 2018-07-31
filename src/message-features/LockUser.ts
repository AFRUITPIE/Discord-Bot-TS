import { BaseHandler } from "./BaseHandler";
import { Commands } from "./Commands";

export class LockUser extends BaseHandler {
  handleMessage() {
    if (this.util.isAdmin() && this.util.commandIs(Commands.LockUser)) {
      const username = this.util.getMessageText(true)[0];
    }
  }
}
