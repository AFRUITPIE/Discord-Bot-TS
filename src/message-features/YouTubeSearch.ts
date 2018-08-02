import * as yt from "youtube-search";
import ytdl from "ytdl-core";
import { BaseHandler, MessageHandler } from "./BaseHandler";
import { Commands } from "./Commands";
import { loginData } from "../app";
import { Message } from "discord.js";

const AsciiTable = require("ascii-table"); //FIXME: Convert this into an import because it looks like garbage

enum Keywords {
  failedSearch = "Something went wrong with the search :(",
  searchHeader = "**Respond with the number of the video you want to play:**\n```"
}

export class YouTubeSearch extends BaseHandler implements MessageHandler {
  private storedResults?: yt.YouTubeSearchResults[];
  private searchOptions: yt.YouTubeSearchOptions = {
    maxResults: 10,
    key: loginData.youtube,
    type: "video"
  };

  handleMessage(message: Message): void {
    if (loginData && message.commandIs(Commands.YouTubeSearch)) {
      console.log(`Searching YouTube for ${message.toString(true)}`);

      if (message.toString(true) === "") {
        message.sendToChannel(`No search query given, sending top videos instead.\n`);
      }
      this.handleYouTubeSearch(message);
    }
    this.handleVideoSelection(message);
  }

  private handleYouTubeSearch(message: Message): void {
    const query = message.toString(true);
    yt.default(query, this.searchOptions, (err, result) => {
      let newResultMessage = new AsciiTable(
        `YouTube search results: ${query.substring(0, 10)}${query.length > 10 ? "..." : ""}`
      );
      newResultMessage.setHeading("Index", "Video Title");

      if (result) {
        // Overwrite results
        this.storedResults = result;

        // Build a message to send
        result.forEach((video, index) => {
          newResultMessage.addRow(index + 1, video.title.substring(0, 30));
        });

        // Sending a weird way in order to handle weird whitespace issues with asciitable
        message.channel.send("```" + newResultMessage.toString() + "```");
      } else if (err) {
        console.error(err);
        message.sendToChannel(Keywords.failedSearch);
      }
    });
  }

  private handleVideoSelection(message: Message): void {
    if (this.storedResults) {
      let vidNumber = parseInt(message.toString()) - 1;

      if (!isNaN(vidNumber)) {
        if (vidNumber + 1 <= this.storedResults.length && vidNumber >= 0) {
          let link = this.storedResults[vidNumber].link;
          console.log(
            `Playing YouTube video #${vidNumber + 1}: ${
              this.storedResults[vidNumber].title
            }: ${link}`
          );

          // Play the video
          let stream = ytdl(link, { filter: "audioonly" });
          this.util.playStream(stream);
          message.delete();
          message.sendToChannel(`Playing ${this.storedResults[vidNumber].title}: ${link}`);
        } else {
          message.sendToChannel(
            `\`${vidNumber + 1}\` is not within 1 and ${this.storedResults.length}, genius.`
          );
        }
      } else {
        // TODO: Does it make sense to reset the search results?
        // Reset stored results if user ignores search results
        // YouTubeSearch.storedResults = undefined;
      }
    }
  }
}
