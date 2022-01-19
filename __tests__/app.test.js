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

describe("/api", () => {
  test("GET: topics status 200 & topics data", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body).toHaveLength(3);
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET status 200 & article with id from client", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).objectContaining({
          author: expect.any(String),
        });
      });
  });
});
