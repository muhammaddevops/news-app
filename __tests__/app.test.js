const request = require("supertest");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("my server", () => {
  test("blank test", () => {});
});

describe("/api", () => {
  test("GET: status 200 & 'all ok' message", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body.msg).toBe("all ok");
      });
  });
});

describe("/api/topics", () => {
  test("GET: topics status 200 & topics data", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        response.body.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET status 200 & article with id from client", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        console.log(response.body.article);
        expect(response.body.article).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            created_at: expect.any(String),
            comment_count: expect.any(String),
            title: expect.any(String),
          })
        );
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("PATCH: update articles votes with new votes object. Custom error failure if votes are not a number", () => {
    const patchVotes = {
      inc_votes: 10,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(patchVotes)
      .expect(200)
      .then((response) => {
        console.log(response.body.article);
        expect(response.body.article).toMatchObject({
          votes: 100 + patchVotes.inc_votes,
        });
      });
  });
});

describe("/api/articles?(...anyQuery)", () => {
  test("GET status 200 & correct articles from multiple client queries", () => {
    return request(app)
      .get("/api/articles?sort_by=title&&order=ASC")
      .expect(200)
      .then((response) => {
        console.log(response.body.articles);
        expect(response.body.articles).toBeSortedBy("title");
      });
  });
});

describe("/api/articles?topicQuery(edge-case)", () => {
  test("GET status 200 & correct articles from client topic queries", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then((res) => {
        expect(res.body.articles).toBeInstanceOf(Array);
        expect(res.body.articles).toHaveLength(1);
        expect(res.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("GET: status 400 & error message invalid topic", () => {
    return request(app)
      .get("/api/articles?topic=invalid")
      .expect(404)
      .then((res) => {
        console.log(res.body);
        expect(res.body.msg).toBe("Not found");
      });
  });
  test("GET: status 400 & error message invalid sort_by", () => {
    return request(app)
      .get("/api/articles?sort_by=invalid")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not found");
      });
  });
});

describe("/api/:article_id/comments", () => {
  test("GET status 200 & comments of the article id from the client", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((res) => {
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body).toHaveLength(2);
      });
  });
});

describe("/api/:article_id/comments", () => {
  test("POST status 201 for comment object with username (from users table) & body & article id from the client", () => {
    const testComment = {
      username: "rogersop",
      body: "Testy Testi Test",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(testComment)
      .expect(201)
      .then((res) => {
        console.log(res.body);
        expect(res.body.comment).toMatchObject({
          comment_id: 19,
          author: "rogersop",
          article_id: 3,
          votes: 0,
          body: "Testy Testi Test",
        });
      });
  });
  test("POST: status 400 & returns an error for no username or body fields", () => {
    const testComment = {
      username: "rogersop",
      body: "",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({ msg: "Bad request" });
      });
  });
});

describe.only("/api/comments/:commentId", () => {
  test("DELETE: status 200 & deleted comment", () => {
    return request(app)
      .delete("/api/comments/2")
      .expect(200)
      .then((res) => {
        console.log(res.body.deleted);
        expect(res.body.deleted).toBeInstanceOf(Array);
        expect(res.body.deleted).toHaveLength(1);
        res.body.deleted.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: 2,
            author: "butter_bridge",
            article_id: 1,
            votes: 14,
            body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
          });
        });
      });
  });
});
