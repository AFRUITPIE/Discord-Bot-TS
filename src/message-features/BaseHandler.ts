import { ChannelUtil } from "../ChannelUtil";
import { MessageUtil } from "../MessageUtil";
export abstract class BaseHandler implements MessageHandler {
  util: ChannelUtil = ChannelUtil.getInstance();
  abstract handleMessage(message: MessageUtil): void;
}

export interface MessageHandler {
  handleMessage(message: MessageUtil): void;
}
