//jshint esversion:8
const RedditScraper = require("reddit-scraper");
const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const NodeCache = require("node-cache");
const cache = new NodeCache({
  stdTTL: 31600
});

app.use(express.urlencoded({
  extended: true
}))
app.use((req, res, next) => {
  res.set('Cache-Control', 'public,max-age=21600');
  next()
})
app.set("view engine", "ejs");
app.use(express.json());
const redditScraperOptions = {
  AppId: process.env.API_ID, // enter the id here
  AppSecret: process.env.API_KEY // enter the secret here
};
app.use(express.static(__dirname + '/views'));
// var allMeme = new Object();
const redditScraper = new RedditScraper.RedditScraper(redditScraperOptions);
console.log("Configuration Loaded!");

const scrapedata = async (SubReddit) => {
  try {
    class Memeobj {
      constructor(Sub) {
        this.Pages = 4;
        this.Records = 25;
        this.SortType = "top";
        this.SubReddit = Sub;
        /* this.Info = null; */
        /* this.urls = []; */
      }
    }
    const obj = new Memeobj(SubReddit);
    const memeData = await redditScraper.scrapeData(obj);
    const memeUrls = await memeData.map(obj => obj.data.url);
    const imgUrl = memeUrls.filter(name => name.includes('.jpg') || name.includes('.png') || name.includes('.jpeg') || name.includes('.gif'));
    return imgUrl;
  } catch (err) {
    console.log('error in scrape');
  }
};

app.get("/", async (req, res) => {
  try {
    if (cache.has("memes")) {
      console.log("memes is in cache")
      let content = await JSON.parse(cache.get("memes"));
      return res.render("index", {
        url: content
      });
    }
    const memes = await scrapedata("memes");
    console.log("homepage url scraped");
    cache.set("memes", JSON.stringify(memes));
    console.log("memes cached")
    res.render("index", {
      url: memes
    });
  } catch (err) {
    console.log("error in home scrape")
  }
});

const check = async (req, res, next) => {
  try {

    const {
      sub
    } = req.params;
    if (cache.has(sub)) {
      console.log(`${sub} is in cache`);
      const content = await JSON.parse(cache.get(sub));
      return res.render("index", {
        url: content
      });
    } else {
      return next();
    }
  } catch (err) {
    console.log('err in check')
  }
};

app.get("/img/:sub", check, async (req, res) => {
  try {
    const {
      sub
    } = req.params;
    const content = await scrapedata(sub);
    const strContent = JSON.stringify(content);
    cache.set(sub, strContent);
    return res.render("index", {
      url: content
    });
  } catch (err) {
    console.log('error in get');
    return res.status(500);
  }
});

app.post("/", (req, res, next) => {
  console.log(`redirecting to ${req.body.id}`);
  res.redirect("/img/" + req.body.id);
  next();
});

var port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log("server has started in " + port);
});