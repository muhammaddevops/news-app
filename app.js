const express = require("express");
const app = express();

const { getTopics, getOK, getArticleById } = require("./controllers/news.js");

app.use(express.json());

app.get("/api", getOK);

app.get("/api/topics", getTopics);
app.get("api/articles/:article_id", getArticleById);

module.exports = app;
