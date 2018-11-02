import { BaseHandler, MessageHandler } from "./BaseHandler";
import { Commands } from "./Commands";
import { Message } from "discord.js";
const tts = require("@google-cloud/text-to-speech");

export class TextToSpeech extends BaseHandler implements MessageHandler {
    handleMessage(message: Message): void {
        if (message.commandIs(Commands.Speak)) {
            let speech: String = message.toString(true)
            const speechClient = new tts.TextToSpeechClient();

            let request = {
                input: { text: speech },
                voice: { languageCode: 'en-US', ssmlGender: 'FEMALE' },
                audioConfig: { audioEncoding: 'MP3' },
            };

            speechClient.synthesizeSpeech(request, (err: Error, response: any) => {
                if (err) {
                    console.error('Speech Synthesis failed:', err);
                } else {
                    this.util.playStream(response.audioContent);
                }
            });
        }
    }
};