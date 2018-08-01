import { BaseHandler, MessageHandler } from "./BaseHandler";
import firebase from "firebase-admin";
import { isUndefined, isNull } from "util";
import { MessageUtil } from "../MessageUtil";

const refName: string = "copyPastas";
export class CopyPasta extends BaseHandler implements MessageHandler {
  private copyPastas: any; // FIXME: any? ugh you suck
  constructor() {
    super();

    // Initialize copypastas from the database as long as there is a firebase app initialized
    if (isUndefined(this.copyPastas) && firebase.apps.length) {
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
    this.copyPastas = snapshot!.val();
  }

  handleMessage(message: MessageUtil): void {
    if (!isUndefined(this.copyPastas) && !isNull(this.copyPastas)) {
      let asdf = this.copyPastas;

      // Checks message against every trigger word in the database
      for (let triggerWord of Object.keys(asdf)) {
        // Sends the copypasta response if the trigger word is found
        if (message.contains(triggerWord)) {
          let copyPastaResponse: string = this.copyPastas[triggerWord];
          console.log(`Copypasta for trigger: ${triggerWord} found, sending message.`);
          message.sendToChannel(copyPastaResponse);
          break;
        }
      }
    }
  }
}
