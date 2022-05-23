import React, { useEffect, useState, useRef, createRef } from 'react';
// import { InputGroup, FormControl, Button } from 'react-bootstrap';
// import Slider from '../../test/Controls/Slider/Slider';
// import ControlPanel from '../../test/Controls/ControlPanel';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import Axios from 'axios';
import { Accordion, FormControl, Button, Card } from 'react-bootstrap';
import Item from '../Item/Item';

export default function List() {
	const [ audioList, setAudioList ] = useState([]);
	const instance = Axios.create({
		baseURL: 'http://localhost:8000/audiofiles',
		timeout: 1000,
		headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
	});

	useEffect(() => {
		instance.get('').then((response) => {
			setAudioList(response.data);
		});
		console.log(audioList);
	}, []);

	const audioFiles = audioList.map((item) => <Item key={item.id} item={item} />);

	return <div>{audioFiles}</div>;
}
