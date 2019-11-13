//jshint esversion:8
const RedditScraper = require("reddit-scraper");
const cheerio = require('cheerio');
const url = require('url');
const express = require("express");
const app = express();

app.set('view engine', 'ejs');


(async () => {

  const redditScraperOptions = {
    AppId: "YZwduUlkpuIkJw",
    AppSecret: "ZcS65djwnC5nT_GmlH4PbPD8SsI",
  };

  const memes = {
    Pages: 5,
    Records: 25,
    SubReddit: "memes",
    SortType: "top",
  };

  const dankMemes = {
    Pages: 5,
    Records: 25,
    SubReddit: "dankmemes",
    SortType: "top",
  };

  const deepFriedMemes = {
    Pages: 5,
    Records: 25,
    SubReddit: "deepfriedmemes",
    SortType: "top",
  };

  try {
    const redditScraper = new RedditScraper.RedditScraper(redditScraperOptions);
    console.log("Configuration Loaded!");

    var memesData = await redditScraper.scrapeData(memes);
    console.log("Memes Subreddit Scraped!");
    var dankMemesData = await redditScraper.scrapeData(dankMemes);
    console.log("DankMemes Subreddit Scraped!");
    var deepFriedMemesData = await redditScraper.scrapeData(deepFriedMemes);
    console.log("DeepFriedMemes Subreddit Scraped!");

    const scrapedData = [].concat.apply([], [memesData, /*memeData,*/ dankMemesData, deepFriedMemesData]);
    var memeCount = 0;
    var skipCount = 0;
    var invalidCount = 0;
    var url = [] ;
    for (i = 0; i < scrapedData.length; i++) {
       url.push(scrapedData[i].data.url);
      console.log(url);
    }

    console.log(scrapedData.length + " total memes fetched.");

  } catch (error) {
    console.error(error);
  }
  app.get("/", function(req, res) {
    res.render("index", {
      url: url
    });
  });

  app.listen(3000, function() {
    console.log("server has started in 3000");
  });

})();
