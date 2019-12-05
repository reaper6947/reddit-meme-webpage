//jshint esversion:8
const RedditScraper = require("reddit-scraper");
const url = require('url');
const express = require("express");
const app = express();
const dotenv = require('dotenv').config();  //this is fro hiding secret in .env file
const apiId = process.env.API_ID;
const apiKey = process.env.API_KEY;


const pageNum = 6 ;
const memeType = "top" ;


app.set('view engine', 'ejs');
(async () => {
  const redditScraperOptions = {

    AppId: apiId ,                           // enter the id here
    AppSecret: apiKey,                      // enter the secret here

  };

  /*  const meme = {
      Pages: 6,
      Records: 25,
      SubReddit: "meme",
      SortType: "top",
    };
  */

  const memes = {
    Pages: pageNum,
    Records: 25,
    SubReddit: "memes",
    SortType: memeType,
  };

  const dank_Meme = {
    Pages: pageNum,
    Records: 25,
    SubReddit: "dank_meme",
    SortType: memeType,
  };

  const deepFriedMemes = {
    Pages: pageNum,
    Records: 25,
    SubReddit: "deepfriedmemes",
    SortType: memeType,
  };

  const memeEconomy = {
    Pages: pageNum,
    Records: 25,
    SubReddit: "MemeEconomy",
    SortType: memeType,
  };

  try
  {
    const redditScraper = new RedditScraper.RedditScraper(redditScraperOptions);
    console.log("Configuration Loaded!");

  /*  var memeData = await redditScraper.scrapeData(meme);
    console.log("Meme Subreddit Scraped!");
  */
    var memesData = await redditScraper.scrapeData(memes);
    console.log("Memes Subreddit Scraped!");
    var dank_MemesData = await redditScraper.scrapeData(dank_Meme);
    console.log("Dank_Memes Subreddit Scraped!");
    var deepFriedMemesData = await redditScraper.scrapeData(deepFriedMemes);
    console.log("DeepFriedMemes Subreddit Scraped!");
    var memeEconomyData = await redditScraper.scrapeData(memeEconomy);
    console.log("MemeEconomy Subreddit Scraped!");

    const scrapedData = [].concat.apply([], [/*memeData,*/ memesData,dank_MemesData,deepFriedMemesData,memeEconomyData ]);
    var memeCount = 0;
    var skipCount = 0;
    var invalidCount = 0;
    var urls = [] ;
    for (i = 0; i < scrapedData.length; i++)
    {
       urls.push(scrapedData[i].data.url);
      console.log(urls);
    }
    console.log(scrapedData.length + " total memes fetched.");
  } catch (error) {
    console.error(error);
  }
  app.get("/", function(req, res) {
    res.render("index", {
      url: urls
    });
  });

  app.get("/apis", (req, res) => {
  res.json(
    urls
  );
  });

var port = process.env.PORT || 5000;
  app.listen(port, function() {
    console.log("server has started in 5000");
  });
})();
