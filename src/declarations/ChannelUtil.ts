import { Channel, User, StreamDispatcher, VoiceChannel, Message } from "discord.js";
import { Readable } from "stream";

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
  static getInstance(message?: Message): ChannelUtil {
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
    // Ensures dispatcher resets on new audio
    if (this.dispatcher) {
      this.dispatcher.end();
    }

    // Join if possible and leave when stream is over
    if (this.message.member.voiceChannel && this.message.isInteractable()) {
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
    this.message.sendToChannel(
      `This channel has been ${channelIsLocked ? "`unlocked`" : "`locked`"}`,
      true
    );
  }

  /**
   * TODO: Implement this
   */
  toggleUserLock() {}

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
