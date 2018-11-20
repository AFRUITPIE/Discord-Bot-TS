import { BaseHandler, MessageHandler } from "./BaseHandler";
import { Commands } from "./Commands";
import { Message } from "discord.js";
import fs, { PathLike } from "fs";
const tts = require("@google-cloud/text-to-speech");

export class TextToSpeech extends BaseHandler implements MessageHandler {
  handleMessage(message: Message): void {
    // Locked to just Hayden for now
    if (!(message.commandIs(Commands.Speak) && message.author.id == "115388431458107401")) {
      return;
    }

    let audioFileDictionary: AudioDirectory = this.getFileDictionary();
    let speech: string = message.toString(true);
    // Uses unix time to ensure no similar file names
    let fileName: PathLike = `audio/${Date.now()}.mp3`;

    // Plays file locally if it already exists
    if (audioFileDictionary[speech] == null) {
      // Creates the speech file
      new tts.TextToSpeechClient().synthesizeSpeech(this.getRequest(speech), (err: Error, response: any) => {
        if (err) {
          console.error("Speech Synthesis failed:", err);
        } else {
          this.writeAudioFile(fileName, response, () => {
            this.addAudioFileToDictionary(speech, fileName, audioFileDictionary);
            this.playFile(fileName);
          });
        }
      });
    } else {
      this.playFile(audioFileDictionary[speech]);
    }
  }

  /**
   * Ensures existence of and returns the audio dictionary
   */
  getFileDictionary(): AudioDirectory {
    // Ensures audio folder exists
    if (!fs.existsSync("audio/")) {
      fs.mkdirSync("audio/");
    }

    // Ensures audio index json exists
    if (!fs.existsSync("audio/index.json")) {
      fs.writeFileSync("audio/index.json", "{}");
    }

    return require("../../audio/index.json") as AudioDirectory;
  }

  /**
   * Generates a Google Cloud TTS request
   * @param speech what to have the TTS say
   */
  getRequest(speech: String) {
    return {
      input: { text: speech },
      voice: { languageCode: "en-US", ssmlGender: "FEMALE" },
      audioConfig: { audioEncoding: "MP3" }
    };
  }

  /**
   * Writes the audio file
   * @param fileName relative path of file
   * @param response audio response from Google Cloud TTS
   * @param callback function to run after done writing, async
   */
  writeAudioFile(fileName: PathLike, response: any, callback: () => void) {
    fs.writeFile(fileName, response.audioContent, "binary", err => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Audio content written to file`);
        callback();
      }
    });
  }

  /**
   *
   * @param speech speech that the bot is saying
   * @param audioFile relative file path
   * @param audioFileDictionary dictionary to add file to
   */
  addAudioFileToDictionary(speech: string, audioFile: PathLike, audioFileDictionary: AudioDirectory) {
    audioFileDictionary[speech] = audioFile;
    fs.writeFileSync("audio/index.json", JSON.stringify(audioFileDictionary));
  }

  /**
   * Plays the file
   * @param fileName path of the file
   */
  playFile(fileName: PathLike) {
    this.util.playFile(fileName);
  }
}

// Interface for the dictionary of audio files
interface AudioDirectory {
  [key: string]: PathLike;
}
