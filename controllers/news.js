const {
  selectTopics,
  selectArticleById,
  updateArticleById,
  selectQueryArticles,
  selectCommentsByArticleId,
  insertCommentByArticleId,
  removeCommentByCommentId,
} = require("../models/news");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      if (topics.length > 0) {
        res.status(200).send(topics);
      } else {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    })
    .catch((err) => next(err));
};

exports.getArticleById = (req, res, next) => {
  const { articleId } = req.params;
  selectArticleById(articleId)
    .then((article) => {
      if (article) {
        res.status(200).send({ article });
      } else {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    })
    .catch((err) => next(err));
};

exports.patchArticleById = (req, res, next) => {
  const { articleId } = req.params;
  const { inc_votes } = req.body;
  if (Object.keys(req.body).length === 0) {
    let err = new Error();
    err.status = 400;
    err.msg = "Empty body";
    return next(err);
  }
  updateArticleById(articleId, inc_votes)
    .then((article) => {
      if (article) {
        res.status(200).send({ article });
      } else {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    })
    .catch((err) => next(err));
};

exports.getQueryArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;

  selectQueryArticles(sort_by, order, topic, article_id)
    .then((articles) => {
      console.log(articles);
      if (articles.length > 0) {
        res.status(200).send({ articles });
      } else {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    })
    .catch((err) => next(err));
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { articleId } = req.params;

  selectCommentsByArticleId(articleId)
    .then((comments) => {
      if (comments.length > 0) {
        res.status(200).send(comments);
      } else {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    })
    .catch((err) => next(err));
};

exports.postCommentByArticleId = (req, res, next) => {
  const { articleId } = req.params;
  const { username, body } = req.body;

  insertCommentByArticleId(articleId, username, body)
    .then((comment) => {
      return res.status(201).send({ comment });
    })
    .catch((err) => next(err));
};

exports.deleteCommentByCommentId = (req, res, next) => {
  const { commentId } = req.params;

  removeCommentByCommentId(commentId)
    .then((deleted) => {
      res.status(200).send({ deleted });
    })
    .catch((err) => next(err));
};

exports.getApiResponse = (req, res, next) => {
  const apiDescription = {
    "GET /api": {
      description:
        "serves up a json representation of all the available endpoints of the api",
    },
    "GET /api/topics": {
      description: "serves an array of all topics",
    },
    "GET /api/articles": {
      description: "serves an array of all topics",
      queries: ["author", "topic", "sort_by", "order"],
      exampleResponse: {
        articles: [
          {
            title: "Seafood substitutions are increasing",
            topic: "cooking",
            author: "weegembump",
            body: "Text from the article..",
            created_at: 1527695953341,
          },
        ],
      },
    },
    "GET /api/articles/:articleId": {
      description: "serves an article object when provided a valid article ID",
    },
    "GET /api/articles/:articleId/comments": {
      description:
        "serves a comments object relating to an article when provided a valid article ID",
    },
    "POST /api/articles/:articleId/comments": {
      description:
        "posts a comments object relating to an article when provided a valid body and article ID",
    },
    "DELETE /api/articles/:articleId/comments": {
      description:
        "deletes a comments object relating to an article when provided a valid comment ID",
    },
  };
  res.status(200).send(apiDescription);
};
