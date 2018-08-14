import { BaseHandler, MessageHandler } from "./BaseHandler";
import firebase from "firebase-admin";
import ytdl from "ytdl-core";
import { isUndefined, isNull } from "util";
import { Message } from "discord.js";

const refName: string = "youtubeLinks";
export class YouTubePasta extends BaseHandler implements MessageHandler {
  private youTubePastas: any; // FIXME: any? ugh you suck
  constructor() {
    super();

    // Initialize YouTubePastas from the database as long as there is a firebase app initialized
    if (isUndefined(this.youTubePastas) && firebase.apps.length) {
      // Initialize the ref
      const databaseRef = firebase.database().ref(refName);

      // Update the local database live if the online database changes
      databaseRef.on("value", snapshot => {
        this.updateYouTubePastas(snapshot);
        console.log("Updated YouTubePastas");
      });
    }
  }

  private updateYouTubePastas(snapshot: any): void {
    if (isNull(snapshot)) {
      console.log(
        `Snapshot for YouTubePastas was null. Please verify that the database has a value ${refName}`
      );
    }
    this.youTubePastas = snapshot!.val();
  }

  handleMessage(message: Message): void {
    if (!isUndefined(this.youTubePastas) && !isNull(this.youTubePastas)) {
      // Checks message against every trigger word in the database
      for (let triggerWord of Object.keys(this.youTubePastas)) {
        // Plays the audio if a YouTubePasta is found
        if (message.contains(triggerWord)) {
          let ytLink: string = this.youTubePastas[triggerWord];
          console.log(`YouTubePasta for trigger: ${triggerWord} found, playing audio.`);
          this.util.playStream(ytdl(ytLink, { filter: "audioonly" }));
          break;
        }
      }
    }
  }
}
