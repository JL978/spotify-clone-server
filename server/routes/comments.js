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

//GET comments by songID
router.get("/song/:song", async(_req, res) => {
  try {
    const comments = await Comment.find({"songID":_req.params.song});
    res.send({comments})
  } catch (e) {
    console.error(e);
  }
})

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



// DELETE a comment
router.delete("/delete/:id", async (req, res) => {
  Comment.deleteOne({ id: req.params.id }).then(function(){
    console.log("Comment deleted"); // Success
    res.status(201).send("")
}).catch(function(error){
    console.log(error); // Failure
});
});


// //DELETE a comment
// router.delete("/delete/:id", async (req, res) => {
//   const { id } = req.query;
//   if (!id) return res.status(400).send({ message: "Please provide an id." });

//   const comment = await Comment.findById(id);
//   if (!comment)
//     return res
//       .status(400)
//       .send({ message: "Doggo with this id does not exist." });

//   await comment.remove();

//   res.status(200).send({ message: "Doggo successfully deleted." });
// });



module.exports = router;