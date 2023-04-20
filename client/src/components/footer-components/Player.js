import React, {
	useState,
	useEffect,
	useContext,
	useImperativeHandle,
	useRef,
	forwardRef,
} from "react";
import axios from "axios";

import ProgressBar from "./ProgressBar";
import NowPlaying from "./NowPlaying";
import ConnectDevices from "./ConnectDevices";
import ControlButton from "./ControlButton";

import AddComment from "./AddComment";

import requestWithToken from "../../utilities/requestWithToken";
import msTimeFormat from "../../utilities/utils";
import putWithToken from "../../utilities/putWithToken";
import { MessageContext } from "../../utilities/context";
import { useHistory } from "react-router-dom";

const Player = forwardRef(({ token }, ref) => {
	const setMessage = useContext(MessageContext);
	const [playbackState, setPlaybackState] = useState({
		play: false,
		shuffle: false,
		repeat: false,
		progress: 0,
		total_time: 0,
	});

	const [scrubPb, setScrubPb] = useState(null);
	const [playback, setPlayback] = useState(0);
	const [volume, setVolume] = useState(1);
	const [connectTip, setConnectTip] = useState(false);
	const [commentTip, setCommentTip] = useState(false);
	
	//added close function to annotations
  	const [closeAnnotations, setCloseAnnotations] = useState(false);
	
	const [playInfo, setPlayInfo] = useState({
		album: {},
		artists: [],
		name: "",
		id: "",
	});

	const timerRef = useRef(null);
	const playbackIntervalRef = useRef(null);
	let player = useRef(null);

	useEffect(() => {
		loadScript();
		apiUpdate();

		window.onSpotifyWebPlaybackSDKReady = () => playerInit();

		return () => {
			source.cancel();
			clearTimeout(timerRef.current);
			clearInterval(playbackIntervalRef.current);
			player.disconnect();
		};
		// eslint-disable-next-line
	}, []);

	const loadScript = () => {
		const script = document.createElement("script");

		script.id = "spotify-player";
		script.type = "text/javascript";
		script.async = "async";
		script.defer = "defer";
		script.src = "https://sdk.scdn.co/spotify-player.js";

		document.body.appendChild(script);
	};

	const playerInit = () => {
		console.log("player init");
		player = new window.Spotify.Player({
			name: "Spotify Clone Player",
			getOAuthToken: (cb) => {
				cb(token);
			},
		});

		// Error handling
		player.addListener("initialization_error", ({ message }) => {
			setMessage(message);
		});
		player.addListener("authentication_error", ({ message }) => {
			setMessage(message);
		});
		player.addListener("account_error", ({ message }) => {
			setMessage(message);
		});
		player.addListener("playback_error", ({ message }) => {
			setMessage(message);
		});

		// Playback status updates
		player.addListener("player_state_changed", (state) => {
			console.log(state);
			try {
				const {
					duration,
					position,
					paused,
					shuffle,
					repeat_mode,
					track_window,
				} = state;
				const { current_track } = track_window;

				setPlayInfo(current_track);
				setPlayback(position / duration);
				setPlaybackState((state) => ({
					...state,
					play: !paused,
					shuffle: shuffle,
					repeat: repeat_mode !== 0,
					progress: position,
					total_time: duration,
				}));
			} catch (error) {
				console.log(error);
			}
		});

		// Ready
		player.addListener("ready", ({ device_id }) => {
			console.log("Ready with Device ID", device_id);
			const tipAccess = localStorage.getItem("tipAccess");
			if (!tipAccess) {
				localStorage.setItem("tipAccess", "true");
				setConnectTip(true);
			}
		});

		// Not Ready
		player.addListener("not_ready", ({ device_id }) => {
			console.log("Device ID has gone offline", device_id);
		});

		// Connect to the player!
		player.connect();
	};

	//Reference for parent component to use updateState
	useImperativeHandle(ref, () => ({
		updateState: () => {
			setPlaybackState((state) => ({ ...state, play: true }));
			updateState();
		},
	}));

	//Use for other components to update the player state only if not connected to the web player
	const updateState = () => {
		if (!player.current) {
			console.log('updating api')
			apiUpdate();
		}
	};

	const apiUpdate = () => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
		}

		requestWithToken("https://api.spotify.com/v1/me/player", token, source)
			.then((response) => {
				switch (response.status) {
					case 200:
						console.log('Song info request status 200')
						const {
							repeat_state,
							shuffle_state,
							is_playing,
							progress_ms,
							item,
							device,
						} = response.data;
						setPlayback(progress_ms / item.duration_ms);

						timerRef.current = setTimeout(
							() => updateState(),
							item.duration_ms - progress_ms + 10
						);

						setVolume(device.volume_percent / 100);
						setPlaybackState((state) => ({
							...state,
							play: is_playing,
							shuffle: shuffle_state,
							repeat: repeat_state !== "off",
							progress: progress_ms,
							total_time: item.duration_ms,
						}));
						setPlayInfo(item);
						break;
					
					case 204:
                        setMessage(
                            "Select a device to start listening"
                        );
                        setConnectTip(true);
                        break;
				
					default:
						console.log(response)
						break;
				}
			})
			.catch((error) => console.log(error));
	};

	const updatePlayback = () => {
		const interval = 500 / playbackState.total_time;
		setPlayback((playback) => playback + interval);
		setPlaybackState((state) => ({ ...state, progress: state.progress + 500 }));
	};

	useEffect(() => {
		if (playbackState.play) {
			playbackIntervalRef.current = setInterval(updatePlayback, 500);
		} else {
			clearInterval(playbackIntervalRef.current);
		}
	
		return () => clearInterval(playbackIntervalRef.current);
		// eslint-disable-next-line
	  }, [playbackState.play]);

	const source = axios.CancelToken.source();

	const togglePlay = () => {
		const url = playbackState.play
			? "https://api.spotify.com/v1/me/player/pause"
			: "https://api.spotify.com/v1/me/player/play";

		putWithToken(url, token, source)
			.then((response) => {
				if (response.status !== 204) {
					// setMessage(
					// 	`ERROR: Something went wrong! Server response: ${response}`
					// );
					console.log(response.status);
				} else {
					console.log(response.status)
					setPlaybackState((state) => ({ ...state, play: !state.play }));
					updateState();
				}
			})
			.catch((error) => setMessage(`ERROR: Choose a Device before using the Player ${error}`));
	};

	const toggleShuffle = () => {
		putWithToken(`https://api.spotify.com/v1/me/player/shuffle?state=${!playbackState.shuffle}`, token, source)
			.then((response) => {
				if (response.status === 204) {
					setMessage(`Shuffle ${playbackState.shuffle ? "Off" : "On"}`);
					setPlaybackState((state) => ({ ...state, shuffle: !state.shuffle }));
					updateState();
				} else {
					if (response.status !== 202) {
						setMessage(
							`ERROR: Something went wrong! Server response: ${response.status}`
						);
					}
					
				}
			})
			.catch((error) => setMessage(`ERROR: shuffle state ${error}`));
	};

	const toggleRepeat = () => {
		const url = playbackState.repeat
			? "https://api.spotify.com/v1/me/player/repeat?state=off"
			: "https://api.spotify.com/v1/me/player/repeat?state=track";

		putWithToken(url, token, source)
			.then((response) => {
				if (response.status === 204) {
					setMessage(`Repeat Track ${playbackState.repeat ? "Off" : "On"}`);
					setPlaybackState((state) => ({ ...state, repeat: !state.repeat }));
					updateState();
				} else {
					if (response.status !== 202) {
						setMessage(
							`ERROR: Something went wrong! Server response: ${response.status}`
						);
					}
				}
			})
			.catch((error) => setMessage(`ERROR: repeat ${error}`));
	};

	const skipNext = () => {
		console.log('Skip button pressed')
		putWithToken("https://api.spotify.com/v1/me/player/next", token, source, {}, "POST")
			.then((response) => {
				switch (response.status) {
					case 204:
					case 202:
						updateState();
						return;
				
					default:
						setMessage(
							`ERROR: Something went wrong! Server response: ${response.status}`
						);
						break;
				}
			})
			.catch((error) => setMessage(`ERROR: ${error}`));
	};

	const skipPrev = () => {
		putWithToken("https://api.spotify.com/v1/me/player/previous", token, source, {}, "POST")
			.then((response) => {
				switch (response.status) {
					case 204:
					case 202:
						updateState();
						return;
				
					default:
						setMessage(
							`ERROR: Something went wrong! Server response: ${response.status}`
						);
						break;
				}
			})
			.catch((error) => setMessage(`ERROR: ${error}`));
	};

	const seekPlayback = (ratio) => {
		const time = Math.round(ratio * playbackState.total_time);
		putWithToken(`https://api.spotify.com/v1/me/player/seek?position_ms=${time}`, token, source, {})
			.then((response) => {
				if (response.status === 204) {
					setPlayback(ratio);
					setPlaybackState((state) => ({ ...state, progress: time }));
					updateState();
				} else {
					if (response.status === 202) {
						return;
					}
					setMessage(
						`ERROR: (seekplayback) Something went wrong! Server response: ${response.status}`
					);
				}
			})
			.catch((error) => setMessage(`ERROR: playback ${error}`));

		setScrubPb(null);
	};

	const scrubPlayback = (ratio) => {
		const time = ratio * playbackState.total_time;
		setScrubPb(time);
	};

	const seekVolume = (ratio) => {
		const integer = Math.round(ratio * 100);
		putWithToken(`https://api.spotify.com/v1/me/player/volume?volume_percent=${integer}`, token, source, {})
			.then((response) => {
				if (response.status === 204) {
					setVolume(ratio);
				} else {
					setMessage(
						`ERROR: Something went wrong! Server response: ${response.status}`
					);
				}
			})
			.catch((error) => {
				setMessage(`ERROR: volume ${error}`);
				console.log(error);
			});
	};

	// Redirects to the annotations page
	const history = useHistory()
	// annotations closes when you press it again
	const routeChangeAnnotations = () => {
	    const path = "/annotations";
	    if (!closeAnnotations) {
	      setCloseAnnotations(!closeAnnotations);
	      history.push(path);
	    } else {
	      const path = "/";
	      setCloseAnnotations(!closeAnnotations);
	      history.push(path);
	    }
	  };

	return (
		<>
			<div className="player">
				<div className="player-left">
					<NowPlaying playInfo={playInfo} />
				</div>

				<div className="player-center">
					<div className="player-control-buttons">
						<ControlButton
							title="Toggle Shuffle"
							icon="Shuffle"
							active={playbackState.shuffle}
							onClick={toggleShuffle}
						/>
						<ControlButton
							title="Previous"
							icon="TrackBack"
							size="x-smaller"
							onClick={skipPrev}
						/>
						<ControlButton
							title={playbackState.play ? "Pause" : "Play"}
							icon={playbackState.play ? "Pause" : "Play"}
							size={playbackState.play ? "smaller" : "larger"}
							extraClass="circle-border"
							onClick={togglePlay}
						/>
						<ControlButton
							title="Next"
							icon="TrackNext"
							size="x-smaller"
							onClick={skipNext}
						/>
						<ControlButton
							title="Toggle Repeat"
							icon="Repeat"
							active={playbackState.repeat}
							onClick={toggleRepeat}
						/>
					</div>

					<div className="player-playback" draggable="false">
						<div className="playback-time" draggable="false">
							{scrubPb
								? msTimeFormat(scrubPb)
								: msTimeFormat(playbackState.progress)}
						</div>
						<ProgressBar
							extraClass="playback"
							value={playback}
							engageClass="engage"
							setValue={(ratio) => seekPlayback(ratio)}
							scrubFunction={scrubPlayback}
						/>
						<div className="playback-time" draggable="false">
							{msTimeFormat(playbackState.total_time)}
						</div>
					</div>
				</div>

				<div className="player-right">
					<div className="extra-controls">
						 <div className="social-features">
							<span className="comment-wrapper">
								{commentTip && (
									<AddComment
										closeTip={() => setCommentTip(false)}
										song_id={playInfo.id}
										token={token}
									/>
								)}
								<ControlButton
									title="Comment"
									icon="Comment" 
									size="x-larger"
									onClick={() => {
										if (playInfo.name !== "") {
											setCommentTip(!commentTip)
										}
									}}
								/>
							</span>
							<span className="annotation-wrapper">
								<ControlButton
										title="Annotations"
										icon="Annotation"
										size="x-larger"
										onClick={() => {
											if (playInfo.name !== "") {
												routeChangeAnnotations()
											}
										}}
									/>
							</span>

						</div>

						<span className="connect-devices-wrapper">
							{connectTip && (
								<ConnectDevices
									token={token}
									closeTip={() => setConnectTip(false)}
								/>
							)}
							<ControlButton
								title="Devices"
								icon="Speaker"
								size="x-larger"
								onClick={() => setConnectTip(!connectTip)}
								active={playbackState.play}
							/>
						</span>

						<div className="volume-control">
							<ControlButton
								title="Volume"
								icon="Volume"
								size="x-larger"
								extraClass="volume"
							/>
							<div style={{ width: "100%" }}>
								<ProgressBar
									extraClass="volume"
									value={volume}
									engageClass="engage"
									setValue={(ratio) => seekVolume(ratio)}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
});

export default Player;
