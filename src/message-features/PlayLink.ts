import { BaseHandler } from "./BaseHandler";
import { Commands } from "./Commands";
import ytdl from "ytdl-core";

export class PlayLink extends BaseHandler {
  handleMessage(): void {
    if (this.util.commandIs(Commands.Play)) {
      const youTubeLink = this.util.getMessageText(true).split(" ")[0];
      const beginTime =
        this.util.getMessageText(true).split(" ")[1] !== ""
          ? this.util.getMessageText(true).split(" ")[1]
          : "0:00";

      if (ytdl.validateURL(youTubeLink)) {
        this.util.playStream(
          ytdl(youTubeLink, {
            quality: "highestaudio",
            begin: beginTime
          })
        );
        console.log(`Playing YouTube video: ${youTubeLink} starting at ${beginTime}`);
      } else {
        this.util.sendToChannel(`\`${youTubeLink}\` is not a recognized YouTube link`);
        console.error(`Failed to play video with link: ${youTubeLink}`);
      }
    }
  }
}
