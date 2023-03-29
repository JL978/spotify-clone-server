const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const Annotation = require('../models/Comment');

//GET all annotations
router.get("/", async (_req, res) => {
    const notes = await Annotation.find();
    res.send({ notes });
  });


//GET annotations by ID

//GET all comments from friends

//POST annotations

//DELETE annotation


module.exports = router;