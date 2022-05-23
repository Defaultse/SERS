import { React } from 'react';
import { useEffect, useState, useRef, createRef } from 'react';
import { useParams } from 'react-router-dom';
import AudioSegment from './AudioSegment';
import Axios from 'axios';
import './AudioDetail.css';

export default function AudioDetail({ props }) {
	let { id } = useParams();
	const [ audioDetails, setAudioDetails ] = useState([]);
	const [ audioSegments, setAudioSegments ] = useState([]);

	const instance = Axios.create({
		baseURL: 'http://localhost:8000/audiofiles/' + id,
		timeout: 1000,
		headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
	});

	useEffect(() => {
		instance.get('').then((response) => {
			setAudioDetails(response.data);
			setAudioSegments(response.data.AudioSegments);
		});
	}, []);

	const audios = audioSegments.map((props) => <AudioSegment key={props.SegmentOrder} props={props} audioId={audioDetails.id}/>);
	console.log(audioSegments)
	
	return (
		<div className="container">
			<h3>Audio Detail</h3>
			<h3>{id}</h3>
			<table className="table">
				<thead>
					<tr>
						<th scope="col">Order</th>
						<th scope="col">Audio</th>
						<th scope="col"></th>
						<th scope="col">Emotion</th>
					</tr>
				</thead>
				<tbody> {audios} </tbody>
			</table>
		</div>
	);
}
