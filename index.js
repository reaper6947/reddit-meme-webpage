//jshint esversion:8
const RedditScraper = require("reddit-scraper");
const express = require("express");
const app = express();
const dotenv = require("dotenv").config(); //this is fro hiding secret in .env file
const NodeCache = require("node-cache");
const cache = new NodeCache({
  stdTTL: 46400
});

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}))

app.use((req, res, next) => {
  res.set('Cache-Control', 'public,max-age=31600');
  next()
})

// app.use(express.static(__dirname + '/public'))

// var allMeme = new Object();
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
    console.log("error in scrape");
  }
};
/*
async () => {
  try {
    allMeme.memes = await scrapedata("memes");
    console.log("Memes Subreddit Scraped!");

    // allMeme.all = [].concat.apply([], [...Object.values(allMeme)]);
    // allMeme.home = JSON.stringify(allMeme.all);
    cache.set("rd45sdf", allMeme.memes);
    console.log(allMeme.memes.length + " total memes fetched.");
  } catch (error) {
    console.log(error);
  }
};
*/

app.get("/", async (req, res) => {
  try {
    if (cache.has("memes")) {
      console.log("memes is in cache")
      content = await JSON.parse(cache.get("memes"));
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
    };
  } catch (err) {
    console.log('err in check')
  }
};
/*
const set = async (req, res, next) => {
  try {
    const {
      sub
    } = req.params;
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
  const {
    sub
  } = req.params;
  const content = cache.get(sub);
  if (content) {
    return res.render("index", {
      url: JSON.parse(content)
    });
  }
  return next();
};
*/
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

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("server has started in " + port);
});