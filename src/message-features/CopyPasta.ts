import { BaseHandler } from "./BaseHandler";
import { loginData } from "../app";
import firebase from "firebase-admin";

export class CopyPasta extends BaseHandler {
  handleMessage(): void {
    let yee = firebase.database().ref("copyPastas");

    console.log(yee);
  }
}
