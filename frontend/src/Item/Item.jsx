import React, { useEffect, useState, useRef, createRef } from 'react';
// import { InputGroup, FormControl, Button } from 'react-bootstrap';
// import Slider from '../../test/Controls/Slider/Slider';
// import ControlPanel from '../../test/Controls/ControlPanel';
// import './Item.css';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import axios from 'axios';

export default function Item() {
	// list track urls
    const [track, setTrack] = useState(); 

	useEffect(() => {
		//get here urls
		axios.get(`localhost:8000/audiofiles/2`).then((res) => {
			console.log(res);
			// setTrack(res);
		});
	}, []);

	return (
		<div className="app-container">
			<audio
				controls
				preload="auto"
				type="audio/mpeg"
				className="width:20px">
				<source src={`https://diploma.blob.core.windows.net/profile4/03-01-02-01-02-02-03.wav`} type="audio/mpeg" />
				Your browser does not support the
				{/* <code>audio</code> element. */}
			</audio>
			{/* <audio
				controls
				preload="auto"
				type="audio/mpeg"
				className="width:20px">
				<source src={`https://diploma.blob.core.windows.net/profile1/03-01-02-01-02-02-03.wav`} type="audio/mpeg" />
				Your browser does not support the
				<code>audio</code> element. 
			</audio>  */}
			{/* <AudioPlayer
				src={'http://localhost:8000/audiofiles/2'}
				// ref={this.player}
				onPlay={(e) => console.log('onPlay')} 
				onBuffer={true}
				showDownloadProgress
				// other props here
			/> 
			{/* <AudioPlayer
				autoPlay
				src="https://teststoragingmp3.blob.core.windows.net/audio/M_0025_11y10m_1.wav"
				onPlay={(e) => console.log('onPlay')} onBuffer
				// other props here
			/> */}
			{/* <audio
                controls
                src={"localhost:8000/audiofiles/2"} type="audio/mpeg" className="width:20px">
					
                Your browser does not support the
                <code>audio</code> element.
            </audio> */}

			{/* <AudioPlayer
			src='https://teststoragingmp3.blob.core.windows.net/audio/Eternal_Raijin_La_Espada.mp3' />  */}
		</div>
	);
}
