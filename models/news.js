const db = require("../db/connection");
const format = require("pg-format");

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

exports.updateArticleById = (articleId, votes) => {
  if (typeof votes !== "number") {
    return Promise.reject({ status: 400, msg: "Bad request" });
  } else {
    let queryValues = [[votes], [articleId]];
    let sqlString = `UPDATE articles SET votes = votes + %L
                  WHERE article_id = %L RETURNING *;`;

    const queryString = format(sqlString, ...queryValues);

    return db.query(queryString).then((results) => {
      return results.rows[0];
    });
  }
};

exports.selectQueryArticles = (
  sort_by = "created_at",
  order = "DESC",
  topic = "*"
) => {
  const allowedSortBys = [
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
  ];
  const allowedOrder = ["ASC", "DESC"];
  if (!allowedSortBys.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  if (!allowedOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
};
