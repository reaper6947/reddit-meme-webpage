//jshint esversion:8
const axios = require('axios');
const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const LRU = require("lru-cache");
const cache = new LRU({ max: 500, maxAge: 1000 * 3600 });

app.use(express.urlencoded({extended: true}))

app.use((req, res, next) => {
  res.set('Cache-Control', 'public,max-age=2592000');
  res.set("Service-Worker-Allowed", value="/");

  next()
})

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static(__dirname + '/views'));
// var allMeme = new Object();

const scrapedata = async (SubReddit) => {
  try {
    //const imgUrl = await axios.get(`https://reddit-zeit.now.sh/url/${SubReddit}`)
    const imgData = axios.get(`https://reddit-zeit.now.sh/url/${SubReddit}`).then(resp => {return(resp.data);});
    return imgData
  } catch (err) {console.log(err);}
};

app.get("/", async (req, res) => {
  try {
    if (cache.has("memes")) {
      console.log("memes is in cache")
      let content = await JSON.parse(cache.get("memes"));
      return res.render("index", {url: content});
    }
    const memes = await scrapedata("memes");
    console.log("homepage url scraped");
    cache.set("memes", JSON.stringify(memes));
    console.log("memes cached")
    res.render("index", {img: memes});
  } catch (err) {
    console.log(`${err}`)
  }
});

const check = async (req, res, next) => {
  try {
    const {sub} = req.params;
    if (cache.has(sub)) {
      console.log(`${sub} is in cache`);
      const content = await JSON.parse(cache.get(sub));
      return res.render("index", {img: content});
    } else {
      return next();
    }
  } catch (err) {
    console.log('err in check')
  }
};

app.get("/img/:sub", check, async (req, res) => {
  try {
    const {sub} = req.params;
    const content = await scrapedata(sub);
    const strContent = JSON.stringify(content);
    cache.set(sub, strContent);
    return res.render("index", {img: content});
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