import { BaseHandler } from "./BaseHandler";

import { PingPong } from "./PingPong";
import { BotSay } from "./BotSay";
import { YouTubeSearch } from "./YouTubeSearch";

export const handlers: Array<any> = [PingPong, BotSay, YouTubeSearch]; // FIXME: any? really?