# AFRUITPIE's TypeScript Discord Bot

This Discord bot is made to be easily extensible and easy to add to new servers. It comes with basic functionality and will be frequently updated with new features.

## Getting Started

### Prerequisites

[Node.JS](https://nodejs.org/en/),[TypeScript](https://www.typescriptlang.org), and [FFMPEG](https://www.ffmpeg.org) must be installed.

A [Discord App](https://discordapp.com/developers/applications/) bot user with token is needed.

In order to use the copypasta and YouTube pasta features, a FireBase application with specific database structure is needed. This is labelled under _Firebase Application Setup_. For this, a service account JSON and Firebase Database URL are needed. I recommend renaming the service account JSON to `firebase.json` and placing it in the root directory of the bot. **The file cannot be named login.json**.

For YouTube search functionality, a [Google Cloud Console](https://console.cloud.google.com/) project credential is needed. See _YouTube Search Setup_ for more information.

### Installing

Clone this Git into the folder you want it in, or download the latest version in a ZIP from the releases page.

Navigate to the project and prepare it with:

```
$ npm install
```

Be patient, the installation may take a few minutes.

To start the bot, run:

```
$ npm start
```

This will open the command line tools for logging in the bot. The steps for using the setup utility are:

1.  Copy and paste the token of the Discord App Bot that you created earlier.
2.  Enter `y` if you want to add a Firebase app for copypasta and YouTube pastas. Enter `n` if you don't want these features and skip to step 5.
3.  Enter the name of the service account json you downloaded and added to the root directory of the bot. I recommend using the name `firebase.json` for ease of use.
4.  Enter the URL of the Firebase database.
5.  Enter `y` if you want to add a YouTube search API token in order to use YouTube search. Enter `n` otherwise, and you're done! The bot should be running.
6.  Enter the token from the Google Cloud Console.

After following the setup app once, it should log in correctly each time. If there are problems logging in, you can manually edit `login.json` or completely delete it nand restart the bot to re-run the setup process.

## Adding/Removing bot featues

### message-features

This folder contains several files that contain message handlers and the interface for `MessageHandler`. Included in this folder is an abstract class `BaseHandler` which allows for easy extension.

### index.ts

`index.ts` contains all of the message features that the bot will try for each message. Simply remove features from `index.ts`' `export` to remove the feature from the bot.

Alternatively, add a feature using the snippet included below to `index.ts` to add features to the bot.

### Snippet

I recommend adding this snippet to your TypeScript snippets in Visual Studio Code:

```
  "Handler": {
    "prefix": "handler",
    "body": "import { BaseHandler, MessageHandler } from \"./BaseHandler\";\nimport { Commands } from \"./Commands\";\nimport { Message } from \"discord.js\";\n\nexport class ${1:ClassName} extends BaseHandler implements MessageHandler { \n  handleMessage(message: Message): void {  \n    $0\n  }\n}",
    "description": "Start a new MessageHandler class"
  }
```

With this snippet, it will be very easy to start new message handlers by simply typing `handler` in a new .ts file.
