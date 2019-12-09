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

  const pgNum = 6 ;
  const sortType = "top" ;
  const recordNum = 25;

    class Memeobj
   {
    constructor(Pages,Records,SubReddit,SortType,)
     {
      this.Pages = Pages ;
      this.Records = Records;
      this.SortType = SortType;
      this.SubReddit = SubReddit;
     }
   }
    const memes          = await new Memeobj(pgNum,recordNum,"memes",sortType);
    const dank_Meme      = await new Memeobj(pgNum,recordNum,"dank_meme",sortType);
    const deepFriedMemes = await new Memeobj(pgNum,recordNum,"deepfriedmemes",sortType);
    const memeEconomy    = await new Memeobj(pgNum,recordNum,"MemeEconomy",sortType);

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
    var url = [] ;
    for ( var i = 0; i < scrapedData.length; i++)
    {
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

  app.get("/apis", (req, res) => {
  res.json(
    url
  );
  });

var port = process.env.PORT || 3000;
  app.listen(port, function() {
    console.log('server has started in ' + port);
  });
})();
