require("dotenv").config();
const axios = require("axios");
const cheerio = require("cheerio");

const { scrapeJokesWithProxy } = require("./scraper"); // Import the scraper module
const { fetchSupportedLanguages, translateText } = require("./translator"); // Import the translator modules
const TelegramBot = require("node-telegram-bot-api");
var currentLanguage = "en";

// Telegram bot initialization
const botToken = process.env.Bot_Token;
const bot = new TelegramBot(botToken, { polling: true });

async function teleBot() {
  const jokes = await scrapeJokesWithProxy();
  const supportedLanguages = await fetchSupportedLanguages();
  const NumberRegex = /^-?\d+(\.\d+)?(e-?\d+)?$/;
  const numberInRangeRegex = /^(100|[1-9][0-9]?|101)$/;

  const welcomeMsg =
    "Hello! I'm Chuck Norris jokes bot.\n\n* Send a number between 1-101 and you will get a joke.\n\n** Send 'set language to [language]' to change the language.";
  const wrongNumberMsg =
    " the number is not between 1-101, please enter a number again.";
  const unidentifiedMsg =
    " Sorry, could not process the request.\n send a number between 1-101 or choose a language";

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text.toLowerCase();


    if (messageText === "/start") {
      bot.sendMessage(chatId, welcomeMsg);
    } else if (messageText.startsWith("set language to")) {
      const parts = messageText.split("set language to ");
      if (parts.length > 1) {
        const selectedLanguage = parts[1].trim().toLowerCase();

        // Map user input to supported Azure languages
        // Check if the user's input matches any supported language
        const languageMatch = Object.entries(supportedLanguages).find(
          ([code, lang]) =>
            lang.name.toLowerCase() === selectedLanguage ||
            lang.nativeName.toLowerCase() === selectedLanguage
        );

        if (languageMatch) {
          currentLanguage = languageMatch[0];
          const response = await translateText("no problem", currentLanguage);
          bot.sendMessage(chatId, response);
        } else {
          bot.sendMessage(
            chatId,
            "Sorry, this language is not supported or recognized."
          );
        }
      }
    } else if (NumberRegex.test(messageText)) {
      if (numberInRangeRegex.test(messageText)) {
        console.log(messageText);
        currentJoke = jokes[parseInt(messageText) - 1];
        if (currentLanguage != "en") {
          const response = await translateText(currentJoke, currentLanguage);
          bot.sendMessage(chatId, response);
        } else {
          bot.sendMessage(chatId, currentJoke);
        }
      } else {
        if (currentLanguage != "en") {
          response = await translateText(wrongNumberMsg, currentLanguage);
          bot.sendMessage(chatId, response);
        } else {
          bot.sendMessage(chatId, wrongNumberMsg);
        }
      }
    } else {
      if (currentLanguage != "en") {
        response = await translateText(unidentifiedMsg, currentLanguage);
        bot.sendMessage(chatId, response);
      } else {
        bot.sendMessage(chatId, unidentifiedMsg);
      }
    }
  });
}
teleBot();
