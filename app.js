const express = require("express");
const app = express();

const {
  getOK,
  getTopics,
  getArticleById,
  patchArticleById,
  getQueryArticles,
} = require("./controllers/news.js");

app.use(express.json());

app.get("/api", getOK);
app.get("/api/topics", getTopics);
app.get("/api/articles/:articleId", getArticleById);

app.patch("/api/articles/:articleId", patchArticleById);
app.get("/api/articles", getQueryArticles);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});
app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
