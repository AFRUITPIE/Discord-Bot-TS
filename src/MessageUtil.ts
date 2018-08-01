import { Message } from "discord.js";
import { ChannelUtil } from "./ChannelUtil";

export class MessageUtil extends Message {
  /**
   * @param removeCommand whether or not to remove the command from the message
   * @returns the string value of the message
   */
  toString(removeCommand?: Boolean): string {
    if (removeCommand) {
      let text = this.content.trim().split(" ");
      text.shift();
      return text.join(" ");
    } else {
      return this.content.toString();
    }
  }

  /**
   * Sends a text message safely
   * @param text text message to send to the current message's channel
   * @param ignoreLock ignores the locked status of a channel when sending
   */
  sendToChannel(text: string, ignoreLock?: boolean): void {
    // Ensures 2000 character limit is safe
    let splitMessage = text.match(/.{1,2000}/g);

    // Only send message if it makes sense to
    if (splitMessage && (this.isInteractable() || ignoreLock)) {
      splitMessage.forEach(segment => {
        this.channel.send(segment);
      });
    }
  }

  /**
   * Helper method to ensure that the bot does not interact with
   * users and channels when it isn't supposed to.
   * @returns whether or not the bot should do something. For example, false if the user is locked in the chat.
   */
  isInteractable(): Boolean {
    ChannelUtil.getInstance();
    // TODO: Check for a lock within the ChannelUtil
    return true;
  }

  /**
   * @returns Whether or not the current message is from an admin user. Defaults to false if no admin role.
   */
  isAdmin(): Boolean {
    let adminRole = this.guild.roles.find("name", "Admin");

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
    return this.member.roles.has(adminRole.id);
  }

  /**
   * Verifies commands from messages
   * @param command command to check against
   * @returns true if the command is the start of the message's text
   */
  commandIs(command: String): Boolean {
    return (
      this.toString()
        .toLowerCase()
        .split(" ")[0] ===
      ";;" + command.toLowerCase()
    );
  }

  /**
   * @param phrase phrase to check for within the message
   * @returns whether or not the message contains that phrase
   */
  contains(phrase: string): Boolean {
    let phraseArray = phrase
      .toString()
      .trim()
      .toLowerCase()
      .split(" ");
    let messageArray = this.toString()
      .trim()
      .toLowerCase()
      .split(" ");

    // If phrase is too big to fit in message, just return false
    if (phraseArray.length > messageArray.length) {
      return false;
    }

    // Checks for the phrase by word
    // FIXME: This is in O(n^2) which is... bad
    for (let i = 0; i < phraseArray.length; i++) {
      // Get a slice of the message with same # of words
      let messageSlice = messageArray.slice(i, i + phraseArray.length);
      // returns true if the internal part is the same
      if (this.arraysAreEqual(messageSlice, phraseArray)) {
        return true;
      }
    }

    // Return false if it is never found
    return false;
  }

  /**
   * @param a array 1
   * @param b array 2
   * @returns whether they are equal
   */
  private arraysAreEqual(a: string[], b: string[]): Boolean {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
}
