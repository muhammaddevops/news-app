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

describe.only("/api/articles?topicQuery", () => {
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
});
