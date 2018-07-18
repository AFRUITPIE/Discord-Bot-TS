import { BaseHandler } from "./BaseHandler";
import { loginData } from "../app";

export class CopyPasta extends BaseHandler {
  handleMessage(): void {
    let firebaseApp = this.util.getFirebaseApp();
    if (firebaseApp) {
      let copyPastas = firebaseApp.database(loginData.firebaseURL);
      console.log(copyPastas);
    }
  }
}
