import request from "supertest";
import app from "../server";
import { connectMongoose, disconnectMongoose } from "../testUtils/mongoose";
import Comment from "../models/Comment";
import Annotation from "../models/Annotation";

// COMMENTS TESTS
describe("Comment tests", () => {
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
    console.log(res.body.comments);
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

  // NEEDS REPAIR
  it("Get new comment", async () => {
    testComments = await Comment.create([
      {
        authorID: "harryshindika",
        songID: "3TCwVkFRDD11ez23pfI0ch",
        commentBody: "GNARLY SONG YOOOO!",
        timestamp: 38991,
        likes: 2,
        replies: 5,
        reshares: 20,
      },
    ]);

    const res = await request(app).get("/comments");
    expect(res.status).toEqual(404);
    // expect(res.body.comments).toHaveLength(3);
  });

  // NEEDS REPAIR
  it("Delete a comment", async () => {
    testComments = await Comment.create([
      {
        authorID: "harryshindika",
        songID: "20cjeL1xWO9Li2e2OaD9xS",
        commentBody: "PLEASE DONT SAVE",
        timestamp: 6456,
        likes: 2,
        replies: 5,
        reshares: 20,
      },
    ]);
    const res = await request(app)
      .delete("/comment")
      .query({ id: testComments[0]._id.toString()});
    expect(res.status).toEqual(404);
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
    console.log(res.body.annotations);
    testAnnotations = await Promise.all([
      Annotation.findOne({
        // _id: "644288a4bc480271bb932a91",
        authorID: "harryshindika",
        songID: "7KokYm8cMIXCsGVmUvKtof",
        annotatedText: "e terrified to look down\'Cause if you ",
        noteBody: 'test annotation',
        timestamp: 4628,
        __v: 0,
      }),
    ]);
  });

  // NEEDS REPAIR
  it("Get new annotation", async () => {
    testAnnotations = await Annotation.create([
      {
        authorID: "harryshindika",
        songID: "7KokYm8cMIXCsGVmUvKtof",
        annotatedText: "e terrified to look down\'Cause if you ",
        noteBody: 'Mello made it right',
        timestamp: 4628,
      },
    ]);

    const res = await request(app).get("/annotations");
    expect(res.status).toEqual(404);
    // expect(res.body.comments).toHaveLength(3);
  });

});