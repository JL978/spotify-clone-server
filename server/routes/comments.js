const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const Comment = require('../models/Comment');

// GET all comments
router.get("/all", async (_req, res) => {
    const comments = await Comment.find();
    res.send({ comments });
  });

//GET comment by ID
router.get("/:id", async (_req, res) => {
    try {
      const f_comment = await Comment.findById(_req.params.id);
      res.send({f_comment});
    } catch (err) {
      console.error(err);
      console.log(err);
    }
});

//GET all comments from friends
//this is not possible with the public API

// POST a comment
router.post("/add", async (req, res) => {
    const { authorID, songID, commentBody, timestamp } = req.body;
    console.log(req.body);
    const comment = await Comment.create({
      authorID: authorID,
      songID: songID,
      commentBody: commentBody,
      timestamp: timestamp
    });
    res.status(201).send({
      comment,
    });
  });

//DELETE a comment
router.delete("/delete/:id", async (req, res) => {
  Comment.deleteOne({ id: req.params.id }).then(function(){
    console.log("Comment deleted"); // Success
    res.status(201).send("")
}).catch(function(error){
    console.log(error); // Failure
});
});

module.exports = router;