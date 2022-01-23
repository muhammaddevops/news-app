const db = require("../db/connection");
const format = require("pg-format");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((result) => {
    return response.rows;
  });
};

exports.selectArticleById = (articleId) => {
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
    .then((response) => response.rows[0]);
};

exports.updateArticleById = (articleId, votes) => {
  if (typeof votes != "number") {
    return Promise.reject({ status: 400, msg: "Bad request" });
  } else {
    let queryValues = [[votes], [articleId]];
    let sqlString = `UPDATE articles SET votes = votes + %L
                  WHERE article_id = %L RETURNING *;`;

    const queryString = format(sqlString, ...queryValues);

    return db.query(queryString).then((responses) => {
      return responses.rows[0];
    });
  }
};

exports.selectQueryArticles = (
  sort_by = "created_at",
  order = "DESC",
  topic
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
  } else {
    let queryValues = [];
    let sqlString = `SELECT articles.*, COUNT(comments.comment_id) AS comment_count
    FROM articles
    JOIN comments ON articles.article_id = comments.article_id`;

    if (topic) {
      queryValues.push(topic);
      sqlString += ` WHERE topic ILIKE %L`;
    }

    sqlString += ` GROUP BY articles.article_id`;

    if (sort_by === "title") {
      queryValues.push(`title`);
      sqlString += ` ORDER BY %I`;
    } else if (sort_by === "body") {
      queryValues.push(`body`);
      sqlString += ` ORDER BY %I`;
    } else if (sort_by === "votes") {
      queryValues.push(`votes`);
      sqlString += ` ORDER BY %I`;
    } else if (sort_by === "topic") {
      queryValues.push(`topic`);
      sqlString += ` ORDER BY %I`;
    } else if (sort_by === "author") {
      queryValues.push(`author`);
      sqlString += ` ORDER BY %I`;
    } else {
      queryValues.push(`created_at`);
      sqlString += ` ORDER BY %I`;
    }

    if (order === "ASC") {
      queryValues.push(` ASC`);
      sqlString += ` %s`;
    } else {
      queryValues.push(` DESC`);
      sqlString += ` %s`;
    }

    const queryString = format(sqlString, ...queryValues);

    return db.query(queryString).then((responses) => {
      return responses.rows;
    });
  }
};

exports.selectCommentsByArticleId = (articleId) => {
  let sqlString = `SELECT comments.* FROM comments WHERE article_id = %L`;
  let queryValues = [articleId];

  const queryString = format(sqlString, ...queryValues);

  return db.query(queryString).then((response) => {
    return response.rows;
  });
};

exports.insertCommentByArticleId = (articleId, username, body) => {
  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  let sqlString = `INSERT INTO comments (article_id, author, body) VALUES (%L, %L, %L) RETURNING *;`;
  let queryValues = [articleId, username, body];

  const queryString = format(sqlString, ...queryValues);

  return db.query(queryString).then((response) => {
    return response.rows[0];
  });
};

exports.removeCommentByCommentId = (commentId) => {
  console.log(commentId);
  let sqlString = `DELETE FROM comments WHERE comment_id = %L RETURNING *`;
  let queryValues = [commentId];

  const queryString = format(sqlString, ...queryValues);

  return db.query(queryString).then((response) => {
    return response.rows;
  });
};
