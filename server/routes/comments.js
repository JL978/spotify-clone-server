const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const Comment = require('../models/Comment');

// GET all comments
router.get("/", async (_req, res) => {
    const comments = await Comment.find();
    res.send({ comments });
  });

// POST a comment
router.post("/", async (req, res) => {
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
router.delete("/", async (req, res) => {
    const { id } = req.query;
    if (!id) return res.status(400).send({ message: "Please provide an id." });
  
    const comment = await Comment.findById(id);
    if (!comment)
      return res
        .status(400)
        .send({ message: "Invalid comment id." });
  
    await comment.remove();
  
    res.status(200).send({ message: "Comment removed." });
  });

module.exports = router;