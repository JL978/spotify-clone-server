import React, { useEffect, useContext, useState } from "react";
import axios from "axios";

//import ConnectDevicesItem from "./ConnectDevicesItem";

//import reqWithToken from "../../utilities/reqWithToken";
//import putWithToken from "../../utilities/putWithToken";

import { MessageContext } from "../../utilities/context";
import { UserContext } from '../../utilities/context';
import reqWithToken from "../../utilities/reqWithToken";




const AddComment = ({ closeTip, song_id, token}) => {
	const [songInfo, setSongInfo] = useState({
		songId: "",
		timestamp: ""
	});
	const [userInfo, setUserInfo] = useState("");
	const user = useContext(UserContext);
	const setMessage = useContext(MessageContext);
	const [commenttext, setCommentText] = useState("");
	
	// // can't post comments without being logged in
	// if (!user) {
	// 	setMessage("Please Log In to use this feature");
	// 	return null;
	// }

	// const {id} = user;
	// console.log(user)

	
	
	

	
	useEffect(() => {

		const source = axios.CancelToken.source();
		const findSongInfo = reqWithToken(
		"https://api.spotify.com/v1/me/player/currently-playing",
		token,
		source)
		const findUserInfo = reqWithToken("https://api.spotify.com/v1/me",token,source)
		findSongInfo()
			.then((response) => {
				
				// const time_stamp = response.timestamp;
				const {is_playing, progress_ms, item} = response.data;
				console.log(item)
				const song_id = item.id;
				const duration = item.duration_ms;
				if (is_playing) {
					setSongInfo({...songInfo, songId:song_id, timestamp: progress_ms});
				} else {
					setSongInfo({...songInfo, songId:song_id, timestamp: 0});
				}
				
				// source.cancel();
			})
			.catch((error) => console.log(error));
		findUserInfo()
			.then((response) => {
				
				const {id} = response.data
				setUserInfo(id);
				// source.cancel();
				
			})
			.catch((error) => console.log(error));

		

	// 	// const exitTarget = document.getElementsByClassName("pill-button-grey");
	// 	// exitTarget[0].addEventListener("click", () => {
	// 	// 	closeTip();
	// 	// });
		
		
	// 	//close comment input box
	// 	// const addtarget = document.getElementsByClassName("pill-button-green");
	// 	// addtarget[0].addEventListener("click", () => {
	// 	// 	// console.log(id);
	// 	// 	const commentData = {
	// 	// 		//todo: find userid rn
	// 	// 		authorID: "",
	// 	// 		songID: id,
	// 	// 		commentBody: commenttext,
	// 	// 		timestamp: musictime
	// 	// 	}
	// 	// 	axios.post("/comments/add",commentData);
	// 	// 	setMessage(
	// 	// 		"Comment Added!"
	// 	// 	);
	// 	// 	closeTip();
	// 	// });

	// 	// return () => {
	// 	// 	source.cancel();
	// 	// };
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleCommentChange = event => {
		setCommentText(event.target.value);
		console.log(event.target.value);
	}

	const closeCommentBox = event => {
		closeTip();
	}

	const handleCommentSubmit = event => {
		
		// const axConfig = {

		// }
		const commentData = {
			//todo: find userid rn
			authorID: userInfo,
			songID: songInfo.songId,
			commentBody: commenttext,
			timestamp: songInfo.timestamp
		}
		console.log(commentData);
		axios.post("/comments/add",commentData);
		setMessage(
			"Comment Added!"
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
					<textarea class="textareacomment" name="freeform" rows="5.5" cols="43" onChange ={handleCommentChange}></textarea>
				</div>
				<button class="pill-button-grey" onClick = {closeCommentBox}>Cancel</button>
				<button class="pill-button-green" onClick = {handleCommentSubmit}>Add</button>
			</div>
		</div>
	);
};

export default AddComment;