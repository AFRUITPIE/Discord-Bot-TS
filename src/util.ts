import { Message, Channel, TextChannel, User, StreamDispatcher } from "discord.js";
import firebase from "firebase";
import { Readable } from "stream";

class Util {
  private static instance: Util;

  private message: Message;
  private lockedServers: Channel[];
  private lockedUsers: User[];
  private dispatcher?: StreamDispatcher;

  private database?: any; // FIXME: This should be something like "database" from firebase

  constructor(message: Message, firebaseLogin?: Object) {
    this.message = message;
    this.lockedServers = [];
    this.lockedUsers = [];

    if (firebaseLogin) {
      firebase.initializeApp(firebaseLogin);
      this.database = firebase.database();
    }
  }

  /**
   * Maintains the singleton pattern of this instance
   * @param message message used to initialize this class.
   * @return the singleton instance of this class
   */
  static getInstance(message?: Message): Util {
    // Create an instance if one does not already exist
    if (!this.instance) {
      // A message is required if it is creating the first instance
      if (message) {
        this.instance = new Util(message);
      } else {
        throw new Error("No message has been defined to initialize the Util class.");
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

  /**
   *
   * @param text string to check the message against
   * @returns whether the message is a match
   */
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

  playStream(stream: Readable) {
    // Ensures dispatcher resets on new audio
    if (this.dispatcher) {
      this.dispatcher.end();
    }

    // Join if possible and leave when stream is over
    if (this.message.member.voiceChannel && this.shouldInteract()) {
      let voiceChannel = this.message.member.voiceChannel;
      voiceChannel.join().then(connection => {
        this.dispatcher = connection.playStream(stream);
        // Disconnects from the voice channel on video end
        this.dispatcher.on("end", end => {
          voiceChannel.leave();
        });
      });
    }
  }

  /**
   * Helper method to ensure that the bot does not interact with
   * users and channels when it isn't supposed to.
   * @returns whether or not the bot should do something. For example, false if the user is locked in the chat.
   */
  shouldInteract(): Boolean {
    return (
      !this.lockedUsers.includes(this.message.author) &&
      !this.lockedServers.includes(this.message.channel)
    );
  }

  /**
   * Verifies commands from messages
   * @param command command to check against
   * @returns true if the command is the start of the message's text
   */
  commandIs(command: String): Boolean {
    return (
      this.message
        .toString()
        .toLowerCase()
        .split(" ")[0] === command.toLowerCase()
    );
  }
}
