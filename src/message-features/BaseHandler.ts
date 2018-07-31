import { Util } from "../util";
export abstract class BaseHandler {
  util: Util = Util.getInstance();
  abstract handleMessage(): void;
}
