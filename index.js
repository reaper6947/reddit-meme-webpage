//jshint esversion:8
const RedditScraper = require("reddit-scraper");
const url = require("url");
const express = require("express");
const app = express();
const dotenv = require("dotenv").config(); //this is fro hiding secret in .env file

var allMeme = new Object();

app.set("view engine", "ejs");


(async () => {
  const redditScraperOptions = {
    AppId: process.env.API_ID, // enter the id here
    AppSecret: process.env.API_KEY // enter the secret here
  };

  try {
    const redditScraper = new RedditScraper.RedditScraper(redditScraperOptions);
    console.log("Configuration Loaded!");

    const scrapedata = async (SubReddit) => {
      try {
        class Memeobj {
          constructor(SubReddit) {
            this.Pages = 1;
            this.Records = 25;
            this.SortType = "top";
            this.SubReddit = SubReddit;
            this.Info = null;
            this.urls = [];
          }
        }

        const obj = new Memeobj(SubReddit);
        obj.Info = await redditScraper.scrapeData(obj);
        obj.urls = await obj.Info.map((obj) => obj.data.url);
        return obj.urls;
      } catch (err) {
        console.log(err);
      }
    };

    allMeme.memes = await scrapedata("memes");
    console.log("Memes Subreddit Scraped!");

    allMeme.dankmemes = await scrapedata("dankmemes");
    console.log("Dank_Memes Subreddit Scraped!");

    allMeme.DeepFriedMemes = await scrapedata("DeepFriedMemes");
    console.log("DeepFriedMemes Subreddit Scraped!");

    allMeme.MemeEconomy = await scrapedata("MemeEconomy");
    console.log("MemeEconomy Subreddit Scraped");

    var scrapedData = [].concat.apply([], [...Object.values(allMeme)]);

    console.log(scrapedData.length);

    console.log(scrapedData.length + " total memes fetched.");
  } catch (error) {
    console.log(error);
  }

  app.get("/", function (req, res) {
    res.render("index", {
      url: scrapedData
    });
  });

  app.get("/apis", (req, res) => {
    res.json(scrapedData);
  });

  var port = process.env.PORT || 3000;
  app.listen(port, function () {
    console.log("server has started in " + port);
  });
})();