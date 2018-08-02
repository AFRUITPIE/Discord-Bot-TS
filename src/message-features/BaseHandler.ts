import { ChannelUtil } from "../declarations/ChannelUtil";
import { Message } from "discord.js";
import "../declarations/MessageDeclaration";

export abstract class BaseHandler implements MessageHandler {
  util: ChannelUtil = ChannelUtil.getInstance();
  abstract handleMessage(message: Message): void;
}

export interface MessageHandler {
  handleMessage(message: Message): void;
}
