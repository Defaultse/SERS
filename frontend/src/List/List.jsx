import React, { useEffect, useState, useRef, createRef } from 'react';
// import { InputGroup, FormControl, Button } from 'react-bootstrap';
// import Slider from '../../test/Controls/Slider/Slider';
// import ControlPanel from '../../test/Controls/ControlPanel';
import './List.css';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import Axios from 'axios';
import { Accordion, FormControl, Button } from 'react-bootstrap';
import Item from '../Item/Item';

export default function List() {
	const [ audioList, setAudioList ] = useState([]);

	// const axios = require('axios').default;

	const instance = Axios.create({
		baseURL: 'http://localhost:8000/audiofiles',
		timeout: 1000,
		headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
	});

	useEffect(() => {
		instance.get('').then((response) => {
			setAudioList(response.data)
		});
		console.log(audioList)
	}, []);

	// const sendGetRequest = async () => {
	// 	try {
	// 		const resp = await axios.get(`http://localhost:8000/audiofiles/2/` + localStorage.getItem('token'));
	// 		console.log(resp.data);
	// 	} catch (err) {
	// 		// Handle Error Here
	// 		console.error(err);
	// 	}
	// 	SetLoading(false);
	// };

	const list = audioList.map((item) => <Item key={item.id} item={item}/>);

	return (
		<div className="app-container">
			<Accordion alwaysOpen className="app-container">
				{list}
				{/* <Accordion.Item>
					<Accordion.Header>Audio #1</Accordion.Header>
					<Accordion.Body>
						<h3>Fetched from Master API</h3>
						<audio controls preload="auto" type="audio/mpeg">
							<source
								src={`http://localhost:8000/audiofiles/2/` + localStorage.getItem('token')}
								type="audio/mpeg"
							/>
							Your browser does not support the
							 <code>audio</code> element. 
						</audio>
						<table class="table">
							<thead>
								<tr>
									<th scope="col">#</th>
									<th scope="col">Speaker</th>
									<th scope="col">Audio</th>
									<th scope="col">Emotion</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<th scope="row">1</th>
									<td>1</td>
									<td>
										<audio controls preload="auto" type="audio/mpeg">
											<source src={``} type="audio/mpeg" />
											Your browser does not support the
											<code>audio</code> element. 
										</audio>
									</td>
									<td>Angry</td>
								</tr>
								<tr>
									<th scope="row">2</th>
									<td>2</td>
									<td>
										<audio controls preload="auto" type="audio/mpeg">
											<source src={``} type="audio/mpeg" />
											Your browser does not support the
											<code>audio</code> element. 
										</audio>
									</td>
									<td>Neutral</td>
								</tr>
							</tbody>
						</table>
						<Button variant="danger">Delete audio files</Button>
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item>
					<Accordion.Header>Audio #2</Accordion.Header>
					<Accordion.Body>
						<h3>Fetched from Azure blob</h3>
						<audio controls preload="auto" type="audio/mpeg">
							<source src={`https://diploma.blob.core.windows.net/qwe/testcall.wav`} type="audio/mpeg" />
							Your browser does not support the
						    <code>audio</code> element. 
						</audio>
						<table class="table">
							<thead>
								<tr>
									<th scope="col">#</th>
									<th scope="col">Speaker</th>
									<th scope="col">Audio</th>
									<th scope="col">Emotion</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<th scope="row">1</th>
									<td>1</td>
									<td>
										<audio controls preload="auto" type="audio/mpeg">
											<source src={``} type="audio/mpeg" />
											Your browser does not support the
										    <code>audio</code> element.
										</audio>
									</td>
									<td>Angry</td>
								</tr>
								<tr>
									<th scope="row">2</th>
									<td>2</td>
									<td>
										<audio controls preload="auto" type="audio/mpeg">
											<source src={``} type="audio/mpeg" />
											Your browser does not support the
										</audio>
									</td>
									<td>Neutral</td>
								</tr>
							</tbody>
						</table>
						<Button variant="danger">Delete audio files</Button>
					</Accordion.Body>
				</Accordion.Item> */}
			</Accordion>

			{/* <audio
				controls
				preload="auto"
				type="audio/mpeg"
				className="width:20px">
				<source src={`https://diploma.blob.core.windows.ne 
				<code>audio</code> element. 
			</audio>  */}
			{/* <AudioPlayer
				src={'http://localhost:8000/audiofiles/2'}
				// ref={this.player}
				
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
