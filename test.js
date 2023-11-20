// const axios = require('axios');
// const cheerio = require('cheerio');

// const url = 'https://parade.com/968666/parade/chuck-norris-jokes/';

// axios.get(url, {
//   headers: {
//     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36'
//   }
// })
//   .then(response => {
//     const html = response.data;
//     const $ = cheerio.load(html);

//     const jokes = [];

//     // Replace the below selector with the appropriate one for the jokes on the page
//     $('div.entry-content p').each((index, element) => {
//       const joke = $(element).text().trim();
//       jokes.push(joke);
//     });

//     // Print the scraped Chuck Norris jokes
//     console.log(jokes);
//   })
//   .catch(error => {
//     console.log('Error fetching the page:', error);
//   });

const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://parade.com/968666/parade/chuck-norris-jokes/', { waitUntil: 'domcontentloaded' });

  // Wait for the jokes to be visible or loaded
  await page.waitForSelector('div.entry-content p');

  const jokes = await page.evaluate(() => {
    const jokeElements = document.querySelectorAll('div.entry-content p');
    const jokes = Array.from(jokeElements).map(element => element.textContent.trim());
    return jokes;
  });

  console.log(jokes);

  await browser.close();
})();
