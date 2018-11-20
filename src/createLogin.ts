import readlineSync from "readline-sync";
import firebase from "firebase-admin";
import fs from "fs";

export interface LoginData {
  token: string;
  firebaseToken?: firebase.ServiceAccount;
  firebaseDatabaseURL?: string;
  youtube?: string;
}

export class CreateLogin {
  run(): LoginData {
    console.log(
      "I detected that you do not have a login file yet.\nSee the README file for more information about getting login information."
    );

    // Temporary login information
    let login: LoginData = {
      token: ""
    };

    login["token"] = readlineSync.question("\nWhat is your Discord login token?: ");

    if (readlineSync.keyInYNStrict("\nDo you want to add a Firebase database?: ")) {
      console.log("\nMake sure the Firebase service account is in the root directory of the bot.");
      login.firebaseToken = require("../" +
        readlineSync.question("\nWhat is the name of the Firebase service account file? (Copy and paste it): "));

      login.firebaseDatabaseURL = readlineSync.question("\nWhat is the Firebase database URL?: ");
    }

    if (readlineSync.keyInYNStrict("\nDo you want to add YouTube search and Google TTS integration?")) {
      login.youtube = readlineSync.question("\nWhat is the Google Cloud Console login token?: ");
      console.log("Make sure to set your $GOOGLE_APPLICATION_CREDENTIALS as explained in the Google Cloud Console");
    }

    console.log("\nCreating your login file for easier future login...");

    // Writes to file
    fs.writeFileSync("login.json", JSON.stringify(login));

    return login;
  }
}
