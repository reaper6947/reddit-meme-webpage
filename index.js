//jshint esversion:8
const RedditScraper = require("reddit-scraper");
const express = require("express");
const app = express();
const dotenv = require("dotenv").config(); //this is fro hiding secret in .env file
const NodeCache = require("node-cache");
const cache = new NodeCache({
  stdTTL: 300 * 60
});

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}))

// app.use(express.static(__dirname + '/public'))

var allMeme = new Object();
const rd45sdf = "site-home-stuff";
app.set("view engine", "ejs");

const redditScraperOptions = {
  AppId: process.env.API_ID, // enter the id here
  AppSecret: process.env.API_KEY // enter the secret here
};

const redditScraper = new RedditScraper.RedditScraper(redditScraperOptions);
console.log("Configuration Loaded!");

const scrapedata = async (SubReddit) => {
  try {
    class Memeobj {
      constructor(SubReddit) {
        this.Pages = 5;
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
    var imgUrl = obj.urls.filter(name => name.includes('.jpg') || name.includes('.png') || name.includes('.jpeg') || name.includes('.gif'));
    return imgUrl;
  } catch (err) {
    console.log(err);
  }
};

(async () => {
  try {
    allMeme.memes = await scrapedata("memes");
    console.log("Memes Subreddit Scraped!");

    allMeme.dankmemes = await scrapedata("dankmemes");
    console.log("Dank_Memes Subreddit Scraped!");

    allMeme.DeepFriedMemes = await scrapedata("DeepFriedMemes");
    console.log("DeepFriedMemes Subreddit Scraped!");
    /*
    allMeme.MemeEconomy = await scrapedata("MemeEconomy");
    console.log("MemeEconomy Subreddit Scraped");
    */
    allMeme.all = [].concat.apply([], [...Object.values(allMeme)]);
    allMeme.home = JSON.stringify(allMeme.all);
    cache.set(rd45sdf, allMeme.home);
    console.log(allMeme.all.length + " total memes fetched.");
  } catch (error) {
    console.log(error);
  }
})();


app.get("/", function (req, res) {
  const home = JSON.parse(cache.get(rd45sdf));
  res.render("index", {
    url: home

  });
});

const set = async (req, res, next) => {
  try {
    const sub = req.params.id;
    const Urls = await scrapedata(sub);
    const urls = JSON.stringify(Urls);
    console.log(Urls.length);
    cache.set(sub, urls);
    return res.render("index", {
      url: Urls


    });
  } catch (err) {
    console.log(err);
    res.status(500);
  }
  next();
};

const get = (req, res, next) => {
  const sub = req.params.id;
  const content = cache.get(sub);
  if (content) {
    return res.render("index", {
      url: JSON.parse(content)

    });
  }
  return next();
};

app.get("/img/:id", get, set);

app.post("/", (req, res, next) => {
  console.log(req.body.id);
  res.redirect("/img/" + req.body.id);
  next();
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("server has started in " + port);
});