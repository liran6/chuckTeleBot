const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");

// Azure Translation API endpoint and access key
const azureEndpoint = "https://api.cognitive.microsofttranslator.com/"; // Replace with your Azure Translation endpoint
const azureEndpoint2 = "https://lirantransl.cognitiveservices.azure.com/"; // Replace with your Azure Translation endpoint
const azureSubscriptionKey = "dab35131624343c6a99e4cc5c7625b80"; // Replace with your Azure subscription key

// Telegram bot initialization
const botToken = "6679798694:AAFVHgJzAuyS6Tly8yHsOAxO-9nXtdZKpQw"; // Replace with your Telegram bot token
const bot = new TelegramBot(botToken, { polling: true });

// Function to fetch supported languages from Azure Translation API
async function fetchSupportedLanguages() {
  try {
    const response = await axios.get(
      `${azureEndpoint}/languages?api-version=3.0`,
      {
        headers: {
            'Ocp-Apim-Subscription-Key': azureSubscriptionKey,
            'Content-type': 'application/json',
        },
      }
    );

    return response.data.translation;
  } catch (error) {
    console.error("Error fetching supported languages:", error);
    return [];
  }
}

// Function to translate text using Azure Translation API
async function translateText(text, targetLanguage) {
  try {
    const response = await axios.post(
      `${azureEndpoint}/translate?api-version=3.0&to=${targetLanguage}`,
      [{ text }],
      {
        headers: {
          "Ocp-Apim-Subscription-Key": azureSubscriptionKey,
          "Content-type": "application/json",
        },
      }
    );

    return response.data[0].translations[0].text;
  } catch (error) {
    console.error("Translation error:", error);
    return "Translation error occurred.";
  }
}

// Event listener for handling messages
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text.toLowerCase();
  let currentLanguage = 'en'

  if (messageText === "/start") {
    bot.sendMessage(
      chatId,
      "Hello! I'm a multilingual bot. Send 'set language to [language]' in English to change the language."
    );
  } else if (messageText.startsWith("set language to")) {
    const parts = messageText.split("set language to ");
    if (parts.length > 1) {
      const selectedLanguage = parts[1].trim().toLowerCase();

      const supportedLanguages = await fetchSupportedLanguages();

      // Map user input to supported Azure languages
      // Check if the user's input matches any supported language
      const languageMatch = Object.entries(supportedLanguages).find(
        ([code, lang]) =>
          lang.name.toLowerCase() === selectedLanguage ||
          lang.nativeName.toLowerCase() === selectedLanguage
      );

      if (languageMatch) {
        // const [languageCode, languageDetails] = languageMatch;
        currentLanguage = languageMatch[0]
        const response = await translateText("no problem", currentLanguage);
        bot.sendMessage(chatId, response);
      } else {
        bot.sendMessage(
          chatId,
          "Sorry, this language is not supported or recognized."
        );
      }
    }
  }
});
