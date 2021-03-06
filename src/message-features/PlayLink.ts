import { BaseHandler, MessageHandler } from "./BaseHandler";
import { Commands } from "./Commands";
import { Message } from "discord.js";
import ytdl from "ytdl-core";

/**
 * Plays a link from a YouTube Video
 */
export class PlayLink extends BaseHandler implements MessageHandler {
  handleMessage(message: Message): void {
    if (message.commandIs(Commands.Play)) {
      const youTubeLink = message.toString(true).split(" ")[0];
      const beginTime =
        message.toString(true).split(" ")[1] !== "" ? message.toString(true).split(" ")[1] : "0:00";

      if (ytdl.validateURL(youTubeLink)) {
        this.util.playStream(
          ytdl(youTubeLink, {
            quality: "highestaudio",
            begin: beginTime
          })
        );
        console.log(`Playing YouTube video: ${youTubeLink} starting at ${beginTime}`);
      } else {
        message.sendToChannel(`\`${youTubeLink}\` is not a recognized YouTube link`);
        console.error(`Failed to play video with link: ${youTubeLink}`);
      }
    }
  }
}