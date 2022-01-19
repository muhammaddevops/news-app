const { json } = require("express");
const { selectTopics } = require("../models/news");

exports.getOK = (req, res, next) => {
  res.status(200).send({ msg: "all ok" });
};

exports.getTopics = (req, res, next) => {
  selectTopics().then((topics) => {
    console.log(topics);
    res.status(200).send(topics);
  });
};
