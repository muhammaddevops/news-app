//change comments ref of topic to article_id

exports.createArticleIdRef = (formattedArticles) => {
  const ref = {};
  formattedArticles.forEach((article) => {
    ref[article.topic] = article.article_id;
  });
  //   console.log(ref);
  return ref;
};

const testArticleObject = [
  {
    article_id: 3,
    title: "mad title",
    topic: "mudness",
    author: "madman",
    body: "I am madman",
    created_at: new Date(1594329060000),
    votes: 99,
  },
];

// createArticleIdRef(testArticleObject);

exports.formattedComments = (commentData, articleIds) => {
  return commentData.map((comment) => {
    return [
      comment.body,
      comment.votes,
      comment.author,
      comment.article_id,
      comment.created_at,
    ];
  });
};
