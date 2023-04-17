const mongoose = require("mongoose");

const AnnotationSchema = new mongoose.Schema({
    authorID : {
        type: "string",
        required: true,
    },
    songID: {
        type: "string",
        required: true
    },
    annotatedText: {
        type: "string"
    },
    noteBody: {
        type: "string"
    },
    timestamp: {
        type: "number"
    }}, {
        collection: "Annotations"
    })

const Annotation = mongoose.model("Annotation", AnnotationSchema);
module.exports = Annotation;