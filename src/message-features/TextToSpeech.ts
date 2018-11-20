import { BaseHandler, MessageHandler } from "./BaseHandler";
import { Commands } from "./Commands";
import { Message } from "discord.js";
import fs, { PathLike } from "fs";
const tts = require("@google-cloud/text-to-speech");

export class TextToSpeech extends BaseHandler implements MessageHandler {
  handleMessage(message: Message): void {
    // Ensures folder exists
    if (!fs.existsSync("./audio/")) {
      fs.mkdirSync("./audio/");
    }

    // currently locked to just Hayden
    if (
      message.commandIs(Commands.Speak) &&
      message.author.id == "115388431458107401"
    ) {
      let speech: String = message.toString(true);
      let fileName: String = speech.replace(/\s/g, "").replace(/\W/g, "");
      const speechClient = new tts.TextToSpeechClient();

      let request = {
        input: { text: speech },
        voice: { languageCode: "en-US", ssmlGender: "FEMALE" },
        audioConfig: { audioEncoding: "MP3" }
      };

      // Plays file locally if it already exists
      if (!fs.existsSync(`./audio/${fileName}.mp3`)) {
        // Creates the speech file
        speechClient.synthesizeSpeech(request, (err: Error, response: any) => {
          if (err) {
            console.error("Speech Synthesis failed:", err);
          } else {
            fs.writeFile(
              `./audio/${fileName}.mp3`,
              response.audioContent,
              "binary",
              err => {
                if (err) {
                  console.error(err);
                } else {
                  console.log(`Audio content written to file`);
                  this.playFile(`./audio/${fileName}.mp3`);
                }
              }
            );
          }
        });
      } else {
        this.playFile(`./audio/${fileName}.mp3`);
      }
    }
  }

  playFile(fileName: PathLike) {
    let stream = fs.createReadStream(fileName);
    this.util.playStream(stream);
  }
}
