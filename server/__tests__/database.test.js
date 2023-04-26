import request from "supertest";
import app from "../server";
import { connectMongoose, disconnectMongoose } from "../testUtils/mongoose";
import Comment from "../models/Comment";

describe("Comment tests", () => {
  let testComments = [];

  beforeEach(async () => {
    await connectMongoose();
  });

  afterEach(async () => {
    await Promise.all(testComments.map((comment) => comment.remove()));
    await disconnectMongoose();
  });

  it('Get all comments', async () => {
    const res = await request(app).get("/comments/all");
    console.log(res);
    expect(res.status).toEqual(200);
    console.log(res.body.comments);
    expect(res.body.comments).toHaveLength(10);
  });
});
