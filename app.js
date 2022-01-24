const express = require("express");
const app = express();

const {
  getTopics,
  getArticleById,
  patchArticleById,
  getQueryArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentByCommentId,
  getApiResponse,
} = require("./controllers/news.js");

app.use(express.json());

app.get("/api", getApiResponse);
app.get("/api/topics", getTopics);
app.get("/api/articles/:articleId", getArticleById);
app.patch("/api/articles/:articleId", patchArticleById);
app.get("/api/articles", getQueryArticles);
app.get("/api/articles/:articleId/comments", getCommentsByArticleId);
app.post("/api/articles/:articleId/comments", postCommentByArticleId);
app.delete("/api/comments/:commentId", deleteCommentByCommentId);

app.all("/*", (req, res) => {
  console.log(err);
  res.status(404).send({ msg: "Route not found" });
});
app.use((err, req, res, next) => {
  console.log(err);
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  console.log(err);
  res
    .status(500)
    .send({
      msg: `Internal server error | REMEMBER Please add '/api' at the start of any link search`,
    });
});

module.exports = app;
