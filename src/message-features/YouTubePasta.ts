import { BaseHandler } from "./BaseHandler";
import firebase from "firebase-admin";
import ytdl from "ytdl-core";
import { isUndefined, isNull } from "util";

const refName: string = "youtubeLinks";
export class YouTubePasta extends BaseHandler {
  private static youTubePastas: any; // FIXME: any? ugh you suck
  constructor() {
    super();

    // Initialize YouTubePastas from the database as long as there is a firebase app initialized
    if (isUndefined(YouTubePasta.youTubePastas) && firebase.apps.length) {
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
    YouTubePasta.youTubePastas = snapshot!.val();
  }

  handleMessage(): void {
    if (!isUndefined(YouTubePasta.youTubePastas) && !isNull(YouTubePasta.youTubePastas)) {
      // Checks message against every trigger word in the database
      for (let triggerWord of Object.keys(YouTubePasta.youTubePastas)) {
        // Plays the audio if a YouTubePasta is found
        if (this.util.messageContains(triggerWord)) {
          let ytLink: string = YouTubePasta.youTubePastas[triggerWord];
          console.log(`YouTubePasta for trigger: ${triggerWord} found, playing audio.`);
          this.util.playStream(ytdl(ytLink, { filter: "audioonly" }));
          break;
        }
      }
    }
  }
}
