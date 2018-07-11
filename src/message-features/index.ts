import { BaseHandler } from "./BaseHandler";

import { PingPong } from "./PingPong";
import { BotSay } from "./BotSay";
import { YouTubeSearch } from "./YouTubeSearch";
import { StopAudio } from "./StopAudio";

export const handlers: Array<any> = [PingPong, BotSay, YouTubeSearch, StopAudio]; // FIXME: any? really?
