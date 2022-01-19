const db = require("../db/connection");

exports.selectTopics = (topicSearch) => {
  return db.query(`SELECT * FROM topics;`).then((result) => {
    return result.rows;
  });
};
