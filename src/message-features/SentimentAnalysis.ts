import { BaseHandler, MessageHandler } from "./BaseHandler";
import { Message } from "discord.js";
const language = require("@google-cloud/language");

/**
 * Scores to be used for the low and high thresholds for sentiment analysis
 * The absolute lowest value is -1.0 and the absolute highest value is 1.0
 */
enum Scores {
  Low = -0.8,
  High = 0.8
}

export class SentimentAnalysis extends BaseHandler implements MessageHandler {
  handleMessage(message: Message): void {
    const client = new language.LanguageServiceClient();
    const document = { content: message.toString(), type: "PLAIN_TEXT" };

    client
      .analyzeSentiment({ document: document })
      .then((results: any) => {
        const sentiment = results[0].documentSentiment;
        if (sentiment.score < Scores.Low) {
          message.sendToChannel("Cheer up, dude :(");
          message.react("☹️");
        }
      })
      .catch((err: Error) => {
        console.log(err);
      });
  }
}
