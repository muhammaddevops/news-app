const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((result) => {
    return result.rows;
  });
};

exports.selectArticleById = (articleId) => {
  // const queryValues = [];
  // let queryStr = 'SELECT * FROM articles JOIN comments ON articles.article_id = comments.article_id';
  // if ('count' in articleId) {
  //     queryStr +=
  // }
  return db
    .query(
      `SELECT articles.*, COUNT(comments.comment_id) AS comment_count 
      FROM articles 
      JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id
      ;`,
      [articleId]
    )
    .then((result) => result.rows[0]);
};
