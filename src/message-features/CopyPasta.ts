import { BaseHandler } from "./BaseHandler";
import firebase from "firebase-admin";
import { isUndefined, isNull } from "util";

const refName: string = "copyPastas";
export class CopyPasta extends BaseHandler {
  private static copyPastas: any; // FIXME: any? ugh you suck
  constructor() {
    super();

    // Initialize copypastas from the database as long as there is a firebase app initialized
    if (isUndefined(CopyPasta.copyPastas) && firebase.apps.length) {
      // Initialize the ref
      const databaseRef = firebase.database().ref(refName);

      // Update the local database live if the online database changes
      databaseRef.on("value", snapshot => {
        this.updateCopyPastas(snapshot);
        console.log("Updated copypastas");
      });
    }
  }

  private updateCopyPastas(snapshot: any): void {
    if (isNull(snapshot)) {
      console.log(
        `Snapshot for copypastas was null. Please verify that the database has a value ${refName}`
      );
    }
    CopyPasta.copyPastas = snapshot!.val();
  }

  handleMessage(): void {
    if (!isUndefined(CopyPasta.copyPastas) && !isNull(CopyPasta.copyPastas)) {
      let asdf = CopyPasta.copyPastas;

      // Checks message against every trigger word in the database
      for (let triggerWord of Object.keys(asdf)) {
        // Sends the copypasta response if the trigger word is found
        if (this.util.messageContains(triggerWord)) {
          let copyPastaResponse: string = CopyPasta.copyPastas[triggerWord];
          console.log(`Copypasta for trigger: ${triggerWord} found, sending message.`);
          this.util.sendToChannel(copyPastaResponse);
          break;
        }
      }
    }
  }
}
