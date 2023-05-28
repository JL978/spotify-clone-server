import React, { useEffect, useContext, useState } from "react";
import axios from "axios";

import { MessageContext } from "../../utilities/context";

import requestWithToken from "../../utilities/requestWithToken";

const AddComment = ({ closeTip, song_id, token, annotation = false, text = ''}) => {
	const [songInfo, setSongInfo] = useState({
		songId: "",
		timestamp: ""
	});
	const [userInfo, setUserInfo] = useState("");
	const setMessage = useContext(MessageContext);
	const [commenttext, setCommentText] = useState("");
	
	/*
	 * Get the song that's currently playing and the id of the user making the comment.
	 */
	useEffect(() => {
		const source = axios.CancelToken.source();
		
		requestWithToken("https://api.spotify.com/v1/me/player/currently-playing", token, source)
			.then(({ data: { progress_ms, item: { id } } }) => setSongInfo({ ...songInfo, songId: id, timestamp: progress_ms }))
			.catch((error) => console.log(error));

		requestWithToken("https://api.spotify.com/v1/me", token, source)
			.then(({ data: { id } }) => setUserInfo(id))
			.catch((error) => console.log(error));
	// eslint-disable-next-line
	}, []); // songInfo, token

	const handleCommentChange = event => {
		setCommentText(event.target.value);
		console.log(event.target.value);
	}

	const closeCommentBox = event => {
		closeTip();
	}

	const handleCommentSubmit = event => {
		const commentData = {
			authorID: userInfo,
			songID: songInfo.songId,
			commentBody: commenttext,
			timestamp: songInfo.timestamp,
			likes: 0,
			replies: 0,
			reshares: 0
		}
		console.log(commentData);
		axios.post(process.env.REACT_APP_BACK_URI + "/comments/add",commentData);
		setMessage(
			"Comment Added!"
		);
		closeTip();
	}

	// Special callback to handle annotation submission
	const handleAnnotationSubmit = event => {
		// console.log(text)
		const annotationData = {
			authorID: userInfo,
			songID: songInfo.songId,
			annotatedText: text,
			noteBody: commenttext,
			timestamp: songInfo.timestamp
		}
		// console.log(annotationData);
		axios.post("/annotations/add", annotationData);
		setMessage(
			"Annotation Added!"
		);
		closeTip();
	}


	return (
		<div className="add-comment" data-source="inside">
			<div className="add-comment-content" data-source="inside">
				<div className="add-comment-title" data-source="inside">
					<h1 data-source="inside">Add Comment</h1>
				</div>
				<div className="commentdiv" data-source="inside">
					<textarea className="textareacomment" name="freeform" rows="5.5" cols="43" onChange ={handleCommentChange}></textarea>
				</div>
				<button className="pill-button-grey" onClick = {closeCommentBox}>Cancel</button>
				<button className="pill-button-green" onClick = {annotation ? handleAnnotationSubmit : handleCommentSubmit}>Add</button>
			</div>
		</div>
	);
};

export default AddComment;