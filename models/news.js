const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((result) => {
    return result.rows;
  });
};

exports.selectArticleById = (articleId) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [articleId])
    .then((result) => result.rows[0]);
};
