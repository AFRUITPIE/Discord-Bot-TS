import { Message, Channel, TextChannel, User, StreamDispatcher, VoiceChannel } from "discord.js";
import firebase from "firebase-admin";
import { Readable } from "stream";

export class Util {
  private static instance: Util;

  private message: Message;
  private lockedServers: Channel[];
  private lockedUsers: User[];
  private dispatcher?: StreamDispatcher;
  private voiceChannel?: VoiceChannel;

  constructor(message: Message) {
    this.message = message;
    this.lockedServers = [];
    this.lockedUsers = [];

    console.log(`Initialized on first message. Message is: ${message.toString()}`);
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

  /**
   * Overrides the current message that this class handles
   * @param message message to override current message with
   */
  setMessage(message: Message): void {
    this.message = message;
    console.log(`New message set: ${message.toString()}`);
  }

  /**
   * @returns current message
   */
  getMessage(): Message {
    return this.message;
  }

  /**
   * @param removeCommand whether or not to remove the command from the message
   * @returns the string value of the message
   */
  getMessageText(removeCommand?: Boolean): string {
    if (removeCommand) {
      let text = this.message
        .toString()
        .trim()
        .split(" ");
      text.shift();
      return text.join(" ");
    } else {
      return this.message.toString();
    }
  }

  /**
   * Sends a text message
   * @param text text message to send to the current message's channel
   */
  sendToChannel(text: string): void {
    this.message.channel.send(text);
  }

  /**
   * @param text string to check the message against
   * @returns whether the message is a match
   */
  messageEquals(text: String): Boolean {
    return this.message.toString().toLowerCase() === text.toLowerCase();
  }

  /**
   *
   * @param phrase phrase to check for within the message
   */
  messageContains(phrase: string): Boolean {
    phrase = phrase.trim().toLowerCase();
    return this.message
      .toString()
      .toLowerCase()
      .includes(phrase);
  }

  /**
   * Play a stream in the voice channel of the current message's author
   * @param stream Stream to be played within the voice channel
   */
  playStream(stream: Readable): void {
    // Ensures dispatcher resets on new audio
    if (this.dispatcher) {
      this.dispatcher.end();
    }

    // Join if possible and leave when stream is over
    if (this.message.member.voiceChannel && this.shouldInteract()) {
      this.voiceChannel = this.message.member.voiceChannel;
      this.voiceChannel.join().then(connection => {
        this.dispatcher = connection.playStream(stream);
        // Disconnects from the voice channel on video end
        this.dispatcher.on("end", end => {
          if (this.voiceChannel) {
            this.voiceChannel.leave();
          }
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
   * @returns Whether or not the current message is from an admin user. Defaults to false if no admin role.
   */
  isAdmin(): Boolean {
    let adminRole = this.message.guild.roles.find("name", "Admin");

    // Escapes this in case there is no admin role at all
    if (adminRole === null) {
      console.log(
        `Please set a role in the server named "Admin", some bot functionality won't work without it`
      );
      // Warn users why it doesn't work
      this.sendToChannel(
        "There is no role in this server dedicated to admins. Please contact the server owner to have one set."
      );
      return false;
    }

    // Finally returns whether the user is an admin
    return this.message.member.roles.has(adminRole.id);
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
        .split(" ")[0] ===
      ";;" + command.toLowerCase()
    );
  }

  /**
   * Stops playing audio in voice channels
   */
  stopAudio(): void {
    if (this.dispatcher && this.voiceChannel) {
      this.dispatcher.end();
      this.voiceChannel.leave();
    }
  }
}
