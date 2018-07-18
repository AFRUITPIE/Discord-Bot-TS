import { BaseHandler } from "./BaseHandler";

import { PingPong } from "./PingPong";
import { BotSay } from "./BotSay";
import { YouTubeSearch } from "./YouTubeSearch";
import { StopAudio } from "./StopAudio";
import { PlayLink } from "./PlayLink";
import { CopyPasta } from "./CopyPasta";

export const handlers: Array<any> = [
  PingPong,
  BotSay,
  YouTubeSearch,
  StopAudio,
  PlayLink,
  CopyPasta
]; // FIXME: any? really?
