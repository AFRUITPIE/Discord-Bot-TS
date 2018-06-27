import { Message, Channel, TextChannel } from "discord.js";

class util {
  private message: Message;
  private static instance: util;

  constructor(message: Message) {
    this.message = message;
  }

  /**
   * Maintains the singleton pattern of this instance
   * @param message message used to initialize this class.
   * @return the singleton instance of this class
   */
  static getInstance(message?: Message): util {
    if (!this.instance) {
      // A message is required if it is creating the first instance
      if (message) {
        this.instance = new util(message);
      } else {
        throw new Error("No message has been defined to initialize the util class.");
      }
    } else {
      // Sets a new message if one is supplied
      if (message) {
        this.instance.setMessage(message);
      }
    }
    return this.instance;
  }

  setMessage(message: Message): void {
    this.message = message;
  }

  sendToChannel(text: string): void {
    this.message.channel.sendMessage(text);
  }

  messageEquals(text: String): Boolean {
    return this.message.toString().toLowerCase() === text.toLowerCase();
  }

  messageContainsWord(word: String): Boolean {
    word = word.toLowerCase();
    for (let substring in this.message
      .toString()
      .toLowerCase()
      .split(" ")) {
      if (substring === word) {
        return true;
      }
    }
    return false;
  }

  playStream() {}

  commandIs() {}

  toggleLock() {}
}
