const db = require("../connection.js");
const format = require("pg-format");
const { createArticleIdRef } = require("../../utils/seed-formatting");
const { formattedComments } = require("../../utils/seed-formatting");

const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;
  return db
    .query(`DROP TABLE IF EXISTS comments;`)
    .then(() => {
      return db.query("DROP TABLE IF EXISTS comments;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS articles;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS users;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS topics;");
    })
    .then(() => {
      return db.query(`
      CREATE TABLE topics (
        slug VARCHAR(255) NOT NULL UNIQUE PRIMARY KEY,
        description VARCHAR(550) NOT NULL
      );`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE users (
        username VARCHAR(255) NOT NULL UNIQUE PRIMARY KEY,
        avatar_url VARCHAR(550) NOT NULL,
        name VARCHAR(550) NOT NULL
      );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE articles (
          article_id SERIAL PRIMARY KEY,
          title VARCHAR(550) NOT NULL,
          body TEXT NOT NULL,
          votes INT DEFAULT 0,
          topic VARCHAR(255) REFERENCES topics(slug),
          author VARCHAR(255) NOT NULL REFERENCES users(username),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE comments (
          comment_id SERIAL PRIMARY KEY,
          author VARCHAR(255) NOT NULL REFERENCES users(username),
          article_id INT REFERENCES articles(article_id),
          votes INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          body TEXT NOT NULL
        );`);
    })
    .then(() => {
      const formatTopics = format(
        `INSERT INTO topics (slug, description) VALUES %L RETURNING *;`,
        topicData.map((topics) => [topics.slug, topics.description])
      );
      return db.query(formatTopics);
    })
    .then(() => {
      const formatUsers = format(
        `INSERT INTO users (username, avatar_url, name) VALUES %L RETURNING *;`,
        userData.map((users) => [users.username, users.avatar_url, users.name])
      );
      return db.query(formatUsers);
    })
    .then(() => {
      const formatArticles = format(
        `INSERT INTO articles (title, body, votes, topic, created_at, author) VALUES %L RETURNING *;`,
        articleData.map((articles) => [
          articles.title,
          articles.body,
          articles.votes,
          articles.topic,
          articles.created_at,
          articles.author,
        ])
      );
      return db.query(formatArticles);
    })
    .then((result) => {
      console.log(result.rows);
      const articleIds = createArticleIdRef(result.rows);
      const commentsRefArticleIds = formattedComments(commentData, articleIds);
      const insertComments = format(
        `INSERT INTO comments (body, votes, author, article_id, created_at) VALUES %L RETURNING *;`,
        commentsRefArticleIds
      );
      return db.query(insertComments);
    })
    .then((result) => {
      return console.log(result.rows);
    });
};

module.exports = seed;
