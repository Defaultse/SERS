import React, { useEffect, useState, useRef, createRef } from 'react';
import { ButtonToolbar, ButtonGroup, Button, InputGroup, Dropdown, DropdownButton } from 'react-bootstrap';
// import Slider from '../../test/Controls/Slider/Slider';
// import ControlPanel from '../../test/Controls/ControlPanel';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import Axios from 'axios';
import { Accordion, FormControl, Card } from 'react-bootstrap';
import Item from '../Item/Item';
import styles from './List.css'

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

	return (
		<>
			<ButtonToolbar className="mb-3" aria-label="Toolbar with Button groups">
				<ButtonGroup className="me-2" aria-label="First group">
					<Button variant="secondary">1</Button> <Button variant="secondary">2</Button>{' '}
					<Button variant="secondary">3</Button> <Button variant="secondary">4</Button>
				</ButtonGroup>
				<DropdownButton as={ButtonGroup} title="Filter by" id="bg-nested-dropdown">
					<Dropdown.Item eventKey="1">Filter 1</Dropdown.Item>
					<Dropdown.Item eventKey="2">Filter 2</Dropdown.Item>
				</DropdownButton>
			</ButtonToolbar>

			{audioFiles}
		</>
	);
}
