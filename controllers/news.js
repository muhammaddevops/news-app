const {
  selectTopics,
  selectArticleById,
  updateArticleById,
  selectQueryArticles,
  selectCommentsByArticleId,
  postCommentByArticleId,
} = require("../models/news");

exports.getOK = (req, res) => {
  res.status(200).send({ msg: "all ok" });
};

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

  selectQueryArticles(sort_by, order, topic)
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
  const { comment } = req.body;

  postCommentByArticleId(articleId, comment)
    .then((comment) => {})
    .catch((err) => next(err));
};
