import React, { useEffect, useContext } from "react";
import axios from "axios";

//import ConnectDevicesItem from "./ConnectDevicesItem";

//import reqWithToken from "../../utilities/reqWithToken";
//import putWithToken from "../../utilities/putWithToken";

import { MessageContext } from "../../utilities/context";



const AddComment = ({ closeTip }) => {
	const setMessage = useContext(MessageContext);

	const source = axios.CancelToken.source();
	useEffect(() => {

		const exitTarget = document.getElementsByClassName("pill-button-grey");
		exitTarget[0].addEventListener("click", () => {
			closeTip();
		});

		const addtarget = document.getElementsByClassName("pill-button-green");
		addtarget[0].addEventListener("click", () => {
			setMessage(
				"Comment Added!"
			);
			closeTip();
		});

		return () => {
			source.cancel();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);




	return (
		<div className="add-comment" data-source="inside">
			<div className="add-comment-content" data-source="inside">
				<div className="add-comment-title" data-source="inside">
					<h1 data-source="inside">Add Comment</h1>
				</div>
				<div className="commentdiv" data-source="inside">
					<textarea class="textareacomment" name="freeform" rows="5.5" cols="43"></textarea>
				</div>
				<button class="pill-button-grey">Cancel</button>
				<button class="pill-button-green">Add</button>
			</div>
		</div>
	);
};

export default AddComment;