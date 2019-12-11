//jshint esversion:8
const RedditScraper = require("reddit-scraper");
const url = require('url');
const express = require("express");
const app = express();
const dotenv = require('dotenv').config();  //this is fro hiding secret in .env file



app.set('view engine', 'ejs');
(async () => {
  const redditScraperOptions = {

    AppId: process.env.API_ID ,                           // enter the id here
    AppSecret: process.env.API_KEY                     // enter the secret here

  };



    class Memeobj
   {
    constructor(SubReddit)
     {
      this.Pages = 6 ;
      this.Records = 25;
      this.SortType = "top";
      this.SubReddit = SubReddit;
      this.Info = null;
      this.urls = [];
     }







   }
    const memes          = await new Memeobj("memes");
    const dank_Meme      = await new Memeobj("dank_meme");
    const deepFriedMemes = await new Memeobj("deepfriedmemes");
    const memeEconomy    = await new Memeobj("MemeEconomy");

  try
  {
    const redditScraper = new RedditScraper.RedditScraper(redditScraperOptions);
    console.log("Configuration Loaded!");

    let scrapedata = async (obj,redditScraper) =>
    {
      try
      {
        obj.Info = await redditScraper.scrapeData(obj);
        obj.urls = await obj.Info.map(obj => obj.data.url);
        return await obj.urls;
      }
      catch(err)
      {
        console.log(err);
      }
    };

    var memesData          = await scrapedata(memes,redditScraper);
    console.log("Memes Subreddit Scraped!");

    var dank_MemesData      = await scrapedata(dank_Meme,redditScraper);
    console.log("Dank_Memes Subreddit Scraped!");

    var deepFriedMemesData = await scrapedata(deepFriedMemes,redditScraper);
    console.log("DeepFriedMemes Subreddit Scraped!");

    var memeEconomyData    = await scrapedata(memeEconomy,redditScraper);
    console.log("MemeEconomy Subreddit Scraped!");

    var scrapedData = [].concat.apply([], [/*memeData,*/ memesData,dank_MemesData,deepFriedMemesData,memeEconomyData ]);
    console.log(scrapedData.length + " total memes fetched.");
  } catch (error) {
    console.error(error);
  }

  app.get("/", function(req, res) {
    res.render("index", {
      url: scrapedData
    });
  });

  app.get("/apis", (req, res) => {
  res.json(
    scrapedData
  );
  });

var port = process.env.PORT || 3000;
  app.listen(port, function() {
    console.log('server has started in ' + port);
  });
})();
