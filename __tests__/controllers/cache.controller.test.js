const mongoose = require("mongoose");
// will use nock for mocking the request objects
const nock = require("nock");
const supertest = require("supertest");

const app = require("../../server");
const request = supertest(app);
const Cache = require("../models/cache.model");

describe("Cache API endpoints", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1/testing", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  beforeEach(async () => {
    // create records here
    // start a for loop of definitie length
  });

  afterEach(async () => {
    // delete records or flush the records created
  });

  afterAll(async () => {
    // dropping the collection and closing DB connection
    await Cache.drop();
    await mongoose.connection.close();
  });

  // these are just dummy test to give you an idea about approach and how should be testing done
  test('GET | get cache', async (done) => {
    const key = 1;
    const res = await request.get(`api/v1/caches/${key}`)

    expect(res.status).toBe(201)
    expect(res.body.data.value).toBe(key)
    done()
  })

  test('GET | get all caches from database', async (done) => {
    const queryString = {
        page: 1,
        limit: 10,
        sort: 1
    }
    const res = await request.get(`/api/v1/caches?page=${page}&limit=${limit}&sort=${sort}`)

    expect(res.status).toBe(200)
    // check length of it with the created one
    expect(res.body.length).toBe(queryString.length)
    // check the query string params as well to test the pagination
    done()
  })
});
