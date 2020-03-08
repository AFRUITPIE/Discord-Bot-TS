import { Channel, User, StreamDispatcher, VoiceChannel, VoiceConnection, Message } from "discord.js";
import { Readable } from "stream";
import { PathLike } from "fs";
const path = require("path");

export class ChannelUtil {
  private static instance: ChannelUtil;

  private message!: Message;
  private lockedChannels: Channel[] = [];
  private lockedUsers: User[] = [];
  private dispatcher?: StreamDispatcher;
  private voiceChannel?: VoiceChannel;

  /**
   * Maintains the singleton pattern of this instance
   * @return the singleton instance of this class
   */
  static getInstance(): ChannelUtil {
    // Create an instance if one does not already exist
    if (!this.instance) {
      this.instance = new ChannelUtil();
    }
    return this.instance;
  }

  /**
   * Overrides the message for easier access to channels
   * @param message message to handle
   */
  setMessage(message: Message) {
    this.message = message;
  }

  /**
   * Play a stream in the voice channel of the current message's author
   * @param stream Stream to be played within the voice channel
   */
  playStream(stream: Readable): void {
    this.playArbitrary(connection => {
      this.dispatcher?.resume()
      this.dispatcher = connection.play(stream).on("speaking", (speaking) => {
        if (!speaking) {
          this.stopAudio()
        }
      });
    });
  }


  /**
   * Plays a file in the voice channel
   * @param file relative file path
   */
  playFile(file: PathLike): void {
    const filePath = path.resolve(file);
    this.playArbitrary(connection => {
      this.dispatcher = connection.play(filePath).on("speaking", (speaking) => {
        if (!speaking) {
          this.stopAudio()
        }
      });
    });
  }

  /**
   * Handles connecting and verifying voice channels to play arbitrary input
   * @param completion what to run when complete (probably playing audio in the voice connection)
   */
  private playArbitrary(completion: (connection: VoiceConnection) => void) {
    this.stopAudio()
    // Join if possible and leave when stream is over
    if (this.message.member?.voice.channel && this.message.isInteractable()) {
      this.voiceChannel = this.message.member.voice.channel;
      this.voiceChannel.join().then(connection => {
        completion(connection);
      }).catch(reason => {
        console.error(reason)
        this.stopAudio()
      })
    }
  }

  /**
   * Toggles the locked status of the current message's channel
   */
  toggleChannelLock() {
    // Removes channel if included, leaves it otherwise
    const channelIsLocked = this.lockedChannels.includes(this.message.channel);
    if (channelIsLocked) {
      let indexOfChannel = this.lockedChannels.indexOf(this.message.channel);
      this.lockedChannels.splice(indexOfChannel, 1);
      console.log(`Unlocking channel ${this.message.channel.id}`);
    } else {
      this.lockedChannels.push(this.message.channel);
      console.log(`Locking channel ${this.message.channel.id}`);
    }

    // Notify users of the new channel lock status
    this.message.sendToChannel(`This channel has been ${channelIsLocked ? "`unlocked`" : "`locked`"}`, true);
  }

  /**
   * TODO: Implement this
   */
  toggleUserLock() {}

  /**
   * Stops playing audio in voice channels
   */
  stopAudio(): void {
    if (this.dispatcher) {
      this.dispatcher.end();
      this.dispatcher = undefined
    }
    if (this.voiceChannel) {
      this.voiceChannel.leave();
      this.voiceChannel = undefined
    }
  }
}
