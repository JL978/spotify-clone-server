import React, {
	useState,
	useEffect,
	useContext,
	useImperativeHandle,
	useRef,
} from "react";
import axios from "axios";
import Heartbeat from "react-heartbeat";

import ProgressBar from "./ProgressBar";
import NowPlaying from "./NowPlaying";
import ConnectDevices from "./ConnectDevices";
import ControlButton from "./ControlButton";

import reqWithToken from "../../utilities/reqWithToken";
import msTimeFormat from "../../utilities/utils";
import putWithToken from "../../utilities/putWithToken";
import { MessageContext, SongContext } from "../../utilities/context";
import { useHistory } from "react-router-dom";

const Player = React.forwardRef(({ token }, ref) => {
	const setMessage = useContext(MessageContext);
	// Song status that will be used to keep track of when a song has changed and the setter
	// function that indicates that change.
	const {song, setSong} = useContext(SongContext)
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
	const [playInfo, setPlayInfo] = useState({
		album: {},
		artists: [],
		name: "",
		id: "",
	});

	const timerRef = useRef(null);
	let player = useRef(null);

	useEffect(() => {
		loadScript();
		apiUpdate();

		window.onSpotifyWebPlaybackSDKReady = () => playerInit();

		return () => {
			source.cancel();
			clearTimeout(timerRef.current);
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
		const requestInfo = reqWithToken(
			"https://api.spotify.com/v1/me/player",
			token,
			source
		);

		requestInfo()
			.then((response) => {
				console.log(response)
				if (response.status === 200) {
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
					// Toggle the song context to indicate that the song has changed.
					// This assumes that apiupdate is being called when the song changes.
					console.log('Song switched')
					song === 0 ? setSong(1) : setSong(0)
				} else if (response.status === 204) {
					setMessage(
						"Player is not working, select a device to start listening"
					);
					setConnectTip(true);
				} else {
					console.log(response);
					// setMessage(
					// 	`ERROR: server response with ${response}. Player feature is unavailable!`
					// );
				}
			})
			.catch((error) => console.log(error));
	};

	const updatePlayback = () => {
		const interval = 500 / playbackState.total_time;
		setPlayback((playback) => playback + interval);
		setPlaybackState((state) => ({ ...state, progress: state.progress + 500 }));
	};

	const source = axios.CancelToken.source();

	const togglePlay = () => {
		const url = playbackState.play
			? "https://api.spotify.com/v1/me/player/pause"
			: "https://api.spotify.com/v1/me/player/play";

		const request = putWithToken(url, token, source);
		request()
			.then((response) => {
				if (response.status !== 204) {
					// setMessage(
					// 	`ERROR: Something went wrong! Server response: ${response}`
					// );
					console.log(response.status);
				} else {
					setPlaybackState((state) => ({ ...state, play: !state.play }));
					updateState();
				}
			})
			.catch((error) => setMessage(`ERROR: Choose a Device before using the Player ${error}`));
	};

	const toggleShuffle = () => {
		const request = putWithToken(
			`https://api.spotify.com/v1/me/player/shuffle?state=${!playbackState.shuffle}`,
			token,
			source
		);
		request()
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

		const request = putWithToken(url, token, source);
		request()
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
		const request = putWithToken(
			"https://api.spotify.com/v1/me/player/next",
			token,
			source,
			{},
			"POST"
		);
		request()
			.then((response) => {
				if (response.status !== 204) {
					console.log('Server error')
					setMessage(
						`ERROR: (skipnext) Something went wrong! Server response: ${response.status}`
					);
					return;
				}
				console.log('Updating state')
				updateState();
			})
			.catch((error) => setMessage(`ERROR: (skipnext 2) ${error}`));
	};

	const skipPrev = () => {
		const request = putWithToken(
			"https://api.spotify.com/v1/me/player/previous",
			token,
			source,
			{},
			"POST"
		);
		request()
			.then((response) => {
				if (response.status !== 204) {
					setMessage(
						`ERROR: Something went wrong! Server response: ${response.status}`
					);
					return;
				}
				updateState();
			})
			.catch((error) => setMessage(`ERROR: previos ${error}`));
	};

	const seekPlayback = (ratio) => {
		const time = Math.round(ratio * playbackState.total_time);
		const request = putWithToken(
			`https://api.spotify.com/v1/me/player/seek?position_ms=${time}`,
			token,
			source,
			{}
		);
		request()
			.then((response) => {
				if (response.status === 204) {
					setPlayback(ratio);
					setPlaybackState((state) => ({ ...state, progress: time }));
					updateState();
				} else {
					setMessage(
						`ERROR: Something went wrong! Server response: ${response.status}`
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
		const request = putWithToken(
			`https://api.spotify.com/v1/me/player/volume?volume_percent=${integer}`,
			token,
			source,
			null
		);
		request()
			.then((response) => {
				if (response.status === 204) {
					setVolume(ratio);
				} else {
					setMessage(
						`ERROR: Something went wrong! Server response: ${response.status}`
					);
				}
			})
			.catch((error) => setMessage(`ERROR: volume ${error}`));
	};

	// Redirects to the annotations page
	const history = useHistory()
	const routeChangeAnnotations = () => {
		const path = '/annotations'
		history.push(path)
	}

	return (
		<>
			{/* {playbackState.play ? null:<Heartbeat heartbeatFunction={updateState} heartbeatInterval={10000}/>} */}
			{playbackState.play ? (
				<Heartbeat heartbeatFunction={updatePlayback} heartbeatInterval={500} />
			) : null}
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
							<ControlButton
									title="Annotations"
									icon="Annotation"
									size="x-larger"
									onClick={routeChangeAnnotations}
								/>

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
