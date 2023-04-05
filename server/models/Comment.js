const mongoose = require("mongoose")

const CommentSchema = new mongoose.Schema({
    authorID : {
        type: "string",
        required: true,
    },
    songID: {
        type: "string",
        required: true
    },
    commentBody: {
        type: "string"
    },
    timestamp: {
        type: "number"
    },
    likes: {
        type: "number"
    },
    replies: {
        type: "number"
    },
    reshares : {
        type: "number"
    }}, {
        collection: "Comments"
    })

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;