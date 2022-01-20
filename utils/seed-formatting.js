//This template can swap values to join tables based on foreign keys. The example below creates an object with a key "topic" and a value "article_id".

createArticleIdRef = (formattedArticles) => {
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

formattedComments = (commentData, articleIds) => {
  return commentData.map((comment) => {
    return [
      comment.body,
      comment.votes,
      comment.author,
      articleIds[commentData.topic],
      comment.created_at,
    ];
  });
};
