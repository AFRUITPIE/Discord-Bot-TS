import * as yt from "youtube-search";
import ytdl from "ytdl-core";
import { BaseHandler } from "./BaseHandler";
import { Commands } from "./Commands";
import * as app from "../app";

const AsciiTable = require("ascii-table"); //FIXME: Convert this into an import because it looks like garbage

enum Keywords {
  failedSearch = "Something went wrong with the search :(",
  searchHeader = "**Respond with the number of the video you want to play:**\n```"
}

export class YouTubeSearch extends BaseHandler {
  private static storedResults?: yt.YouTubeSearchResults[];
  private searchOptions: yt.YouTubeSearchOptions = {
    maxResults: 10,
    key: app.loginData.youtube,
    type: "video"
  };

  handleMessage(): void {
    if (app.loginData) {
      if (this.util.commandIs(Commands.YouTubeSearch)) {
        console.log(`Searching YouTube for ${this.util.getMessageText(true)}`);

        if (this.util.getMessageText(true) === "") {
          this.util.sendToChannel(`No search query given, sending top videos instead.\n`);
        }
        this.handleYouTubeSearch();
      }
      this.handleVideoSelection();
    }
  }

  private handleYouTubeSearch(): void {
    yt.default(this.util.getMessageText(true), this.searchOptions, (err, result) => {
      let newResultMessage = new AsciiTable(
        `YouTube search results: ${this.util.getMessageText(true).substring(0, 30)}`
      );
      newResultMessage.setHeading("Index", "Video Title");

      if (result) {
        // Overwrite results
        YouTubeSearch.storedResults = result;

        // Build a message to send
        result.forEach((video, index) => {
          newResultMessage.addRow(index + 1, video.title.substring(0, 30));
        });

        this.util.sendToChannel("```" + newResultMessage.toString() + "```");
      } else if (err) {
        console.error(err);
        this.util.sendToChannel(Keywords.failedSearch);
      }
    });
  }

  private handleVideoSelection(): void {
    if (YouTubeSearch.storedResults) {
      let vidNumber = parseInt(this.util.getMessage().toString()) - 1;

      if (!isNaN(vidNumber)) {
        if (vidNumber + 1 <= YouTubeSearch.storedResults.length && vidNumber >= 0) {
          let link = YouTubeSearch.storedResults[vidNumber].link;
          console.log(
            `Playing YouTube video #${vidNumber + 1}: ${
              YouTubeSearch.storedResults[vidNumber].title
            }: ${link}`
          );

          // Play the video
          let stream = ytdl(link, { filter: "audioonly" });
          this.util.playStream(stream);
          this.util.getMessage().delete();
          this.util.sendToChannel(
            `Playing ${YouTubeSearch.storedResults[vidNumber].title}: ${link}`
          );
        } else {
          this.util.sendToChannel(
            `\`${vidNumber + 1}\` is not within 1 and ${
              YouTubeSearch.storedResults.length
            }, genius.`
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
