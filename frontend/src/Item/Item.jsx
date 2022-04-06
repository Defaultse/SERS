import React, { useEffect, useState, useRef } from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
// import Slider from '../../test/Controls/Slider/Slider';
// import ControlPanel from '../../test/Controls/ControlPanel';
import './Item.css';
import AudioPlayer from 'react-h5-audio-player';
// import 'react-h5-audio-player/lib/styles.css';
import axios from 'axios';
import ReactPlayer from 'react-player'

export default function Item() {

	useEffect(() => {
		axios.get(`localhost:8000/audiofiles/2`)
		  .then((res) => {
			  console.log(res);
			// setTracks(res.data.items);
		  });
	}, []);
  	
	return (
		<div className="app-container">
			 <audio
                controls
                src={"https://teststoragingmp3.blob.core.windows.net/audio/Eternal_Raijin_La_Espada.mp3"} type="audio/mpeg" className="width:20px">
					
                Your browser does not support the
                <code>audio</code> element.
            </audio>
			<audio
                controls
                src={"localhost:8000/audiofiles/2"} type="audio/mpeg" className="width:20px">
					
                Your browser does not support the
                <code>audio</code> element.
            </audio>

			{/* <ReactPlayer url='https://teststoragingmp3.blob.core.windows.net/audio/Eternal_Raijin_La_Espada.mp3' />
       
		  <AudioPlayer
			src='https://teststoragingmp3.blob.core.windows.net/audio/Eternal_Raijin_La_Espada.mp3' /> */}
		</div>
	);
}
