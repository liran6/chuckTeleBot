require('dotenv').config();

const axios = require("axios");
const cheerio = require("cheerio");

const apiKey = process.env.Scraper_Api_Key;

// Function to scrape Chuck Norris jokes using ScraperAPI
async function scrapeJokesWithProxy() {
  try {
    const response = await axios.get(
      "https://api.scraperapi.com?api_key=" +
        apiKey +
        "&url=https://parade.com/968666/parade/chuck-norris-jokes/",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
          // Add more headers if necessary based on the website's requirements
        },
      }
    );
    console.log("Response status:", response.status);
    // console.log('Response data:', response.data);
    const $ = cheerio.load(response.data);
    const jokes = [];

    $("ol li").each((index, element) => {
      jokes.push($(element).text().trim());
    });
    // console.log('Jokes:' , jokes)
    return jokes;
  } catch (error) {
      console.error("Error during scraping:", error);
      await scrapeJokesWithProxy()
    // return [];
  }
}

module.exports = { scrapeJokesWithProxy };
