const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const Annotation = require('../models/Annotation');

//GET all annotations
router.get("/all", async (_req, res) => {
    const notes = await Annotation.find();
    res.send({ notes });
  });


//GET annotations by ID
router.get("/:id", async (_req, res) => {
  try {
    const f_annotation = await Annotations.findById(_req.params.id);
    res.send({f_annotation});
  } catch (err) {
    console.error(err);
    console.log(err);
  }
});

//GET all comments from friends
//not possible

//POST annotation
router.post("/add", async (req, res) => {
  const { authorID, songID, noteBody, timestamp } = req.body;
  console.log(req.body);
  const annotation = await Annotation.create({
    authorID: authorID,
    songID: songID,
    noteBody: noteBody,
    timestamp: timestamp
  });
  res.status(201).send({
    annotation,
  });
});

//DELETE annotation


module.exports = router;