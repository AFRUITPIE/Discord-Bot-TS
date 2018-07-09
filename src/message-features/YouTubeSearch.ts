import * as yt from "youtube-search";
import ytdl from "ytdl-core";
import { BaseHandler } from "./BaseHandler";
import { Commands } from "./Commands";
import * as app from "../app";

enum Keywords {
  failedSearch = "Something went wrong with the search :(",
  searchHeader = "**Respond with the number of the video you want to play:**\n```"
}

export class YouTubeSearch extends BaseHandler {
  private static storedResults?: yt.YouTubeSearchResults[];
  private numResults = 10;

  handleMessage(): void {
    if (app.loginData) {
      if (this.util.commandIs(Commands.YouTubeSearch)) {
        console.log(`Searching YouTube for ${this.util.getMessageText(true)}`);
        let options: yt.YouTubeSearchOptions = {
          maxResults: this.numResults,
          key: app.loginData.youtube,
          type: "video"
        };

        if (this.util.getMessageText(true) === "") {
          this.util.sendToChannel(`No search query given, sending top videos instead.\n`);
        }

        yt.default(this.util.getMessageText(true), options, (err, result) => {
          let resultMessage: string = Keywords.searchHeader;
          if (result) {
            // Overwrite results
            YouTubeSearch.storedResults = result;

            // Build a message to send
            result.forEach((video, index) => {
              resultMessage += `\n ${index + 1}: ${video.title}`;
            });
            resultMessage += "```";
            this.util.sendToChannel(resultMessage);
          } else if (err) {
            console.error(err);
            this.util.sendToChannel(Keywords.failedSearch);
          }
        });
      }

      // Play video if possible
      if (YouTubeSearch.storedResults) {
        try {
          let vidNumber = parseInt(this.util.getMessage().toString()) - 1;
          if (vidNumber + 1 <= YouTubeSearch.storedResults.length && vidNumber >= 0) {
            let link = YouTubeSearch.storedResults[vidNumber].link;
            console.log(
              `Playing YouTube video #${vidNumber + 1}: ${
                YouTubeSearch.storedResults[vidNumber].title
              }: ${link}`
            );

            let stream = ytdl(link, { filter: "audioonly" });
            this.util.playStream(stream);
            this.util.getMessage().delete();
            this.util.sendToChannel(
              `Playing ${YouTubeSearch.storedResults[vidNumber].title}: ${link}`
            );
          } else {
            // this.util.sendToChannel(
            //   `\`${vidNumber + 1}\` is not within 1 and ${
            //     YouTubeSearch.storedResults.length
            //   }, genius.`
            // );
          }
        } catch (err) {
          // Do nothing, this is fine in cases where no vid was selected
        }
      }
    }
  }
}
