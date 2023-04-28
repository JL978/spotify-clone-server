import request from "supertest";
import app from "../server";
import { connectMongoose, disconnectMongoose } from "../testUtils/mongoose";
import Comment from "../models/Comment";
import Annotation from "../models/Annotation";

// COMMENTS TESTS
describe("Comments tests", () => {
  let testComments = [];

  beforeEach(async () => {
    await connectMongoose();
  });

  afterEach(async () => {
    // await Promise.all(testComments.map((comment) => comment.remove() ));
    await disconnectMongoose();
  });

  // GOOD TEST
  it("Get all comments", async () => {
    const res = await request(app).get("/comments/all");
    expect(res.status).toEqual(200);
    testComments = await Promise.all([
      Comment.findOne({
        _id: "644288a4bc480271bb932a91",
        authorID: "harryshindika",
        songID: "0AoBY2Y3qs6dtGgOD6c91N",
        commentBody: "dope ssdivgfudev",
        timestamp: 12572,
        __v: 0,
      }),
    ]);
  });

  // GOOD TEST
  it("Create new comment", async () => {
    const res = await request(app).post("/comments/add").send({
      authorID: "harryshindika",
      songID: "3TCwVkFRDD11ez23pfI0ch",
      commentBody: "Bam Wam",
      timestamp: 38991,
    });
    expect(res.status).toEqual(201);
    testComments = await Promise.all([
      Comment.findOne({
        authorID: "harryshindika",
        songID: "3TCwVkFRDD11ez23pfI0ch",
        commentBody: "Bam Wam",
      }),
    ]);
    expect(testComments).toHaveLength(1);
    expect(testComments[0]).toBeTruthy();
  });

  // GOOD TEST
  it("Delete a comment", async () => {
    testComments = await Comment.create({
      authorID: "harryshindika",
      songID: "2VND3CJN5N7uB5ZQwsygVo",
      commentBody: "Bam Wam",
      timestamp: 38991,
    });

    const res = await request(app)
      .delete("/comments/delete/2VND3CJN5N7uB5ZQwsygVo")
      .query({  });

    testComments = await Comment.deleteOne({
      songID: "2VND3CJN5N7uB5ZQwsygVo",
    });
    expect(res.status).toEqual(201);
  });
});

// ANNOTATIONS TESTS
describe("Annotations tests", () => {
  let testAnnotations = [];

  beforeEach(async () => {
    await connectMongoose();
  });

  afterEach(async () => {
    // await Promise.all(testComments.map((comment) => comment.remove() ));
    await disconnectMongoose();
  });

  // GOOD TEST
  it("Get all Annotations for a song", async () => {
    const res = await request(app).get("/annotations/all");
    expect(res.status).toEqual(200);
    console.log(res.body);
    testAnnotations = await Promise.all([
      Annotation.find({
        // _id: "644288a4bc480271bb932a91",
        authorID: "harryshindika",
        songID: "7KokYm8cMIXCsGVmUvKtof",
        annotatedText: "e terrified to look down'Cause if you ",
        noteBody: "test annotation",
        timestamp: 4628,
      }),
    ]);
  });

  // GOOD TEST
  it("Create new annotation", async () => {
    const res = await request(app).post("/annotations/add").send({
      authorID: "harryshindika",
      songID: "7KokYm8cMIXCsGVmUvKtof",
      annotatedText: "e terrified to look down'Cause if you ",
      noteBody: "love me",
      timestamp: 4628,
    });
    expect(res.status).toEqual(201);
  });
});
