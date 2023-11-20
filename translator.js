require('dotenv').config();

const axios = require("axios");
const cheerio = require("cheerio");

// Azure Translation API endpoint and access key
const azureEndpoint = "https://api.cognitive.microsofttranslator.com/";
const azureSubscriptionKey = process.env.Azure_Api_Key;


// Function to fetch supported languages from Azure Translation API
async function fetchSupportedLanguages() {
    try {
      const response = await axios.get(
        `${azureEndpoint}/languages?api-version=3.0`,
        {
          headers: {
            "Ocp-Apim-Subscription-Key": azureSubscriptionKey,
            "Content-type": "application/json",
          },
        }
      );
      console.log("Response status:", response.status);
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
      console.log("Response post status:", response.status);
      return response.data[0].translations[0].text;
    } catch (error) {
      console.error("Translation error:", error);
      return "Translation error occurred.";
    }
  }

  module.exports = { fetchSupportedLanguages, translateText }