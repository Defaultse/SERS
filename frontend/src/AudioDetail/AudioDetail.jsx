import { React } from 'react';
import { useEffect, useState, useRef, createRef } from 'react';
import { useParams } from 'react-router-dom';
import AudioSegment from './AudioSegment';
import Axios from 'axios';
import './AudioDetail.css';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getNextKeyDef } from '@testing-library/user-event/dist/keyboard/getNextKeyDef';
import Moment from 'moment';

function count_angry(segments) {
	let cnt = 0;
	for (let i = 0; i < segments.length; i++) {
		if (segments[i].SegmentEmotion == 'angry') {
			cnt++;
		}
	}
	return cnt;
}

function count_neutral(segments) {
	let cnt = 0;
	for (let i = 0; i < segments.length; i++) {
		if (segments[i].SegmentEmotion == 'neutral') {
			cnt++;
		}
	}
	return cnt;
}

export default function AudioDetail({ props }) {
	let { id } = useParams();
	const [ audioDetails, setAudioDetails ] = useState([]);
	const [ audioSegments, setAudioSegments ] = useState([]);
	let angry = count_angry(audioSegments);
	let neutral = count_neutral(audioSegments);
	let others = audioSegments.length - (angry + neutral);

	const data = [
		{
			name: 'Angry',
			emotion: angry
		},
		{
			name: 'Neutral',
			emotion: neutral
		},
		{
			name: 'Others',
			emotion: others
		}
	];

	const renderBarChart = (
		<BarChart
			width={250}
			height={300}
			data={data}
			margin={{
				top: 5,
				right: 5,
				left: 5,
				bottom: 5
			}}
		>
			<CartesianGrid strokeDasharray="3 3" />
			<XAxis dataKey="name" />
			<YAxis />
			<Tooltip />
			<Legend />
			<Bar dataKey="emotion" fill="#7c8ea1" />
		</BarChart>
	);

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

	const audios = audioSegments.map((props) => (
		<AudioSegment key={props.SegmentOrder} props={props} audioId={audioDetails.id} />
	));

	return (
		<div className="container">
			<div class="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
				<div class="col p-4 d-flex flex-column position-static">
					<h5>Details</h5>
					<p>Audio ID: {id}</p>
					<p>Upload date: {Moment(audioDetails.UploadDate).format('LLLL')} </p>
					<br />
					<div>
						<p>Full audio:</p>
						<audio controls preload="auto" type="audio/mpeg" className="width:20px">
							<source
								src={`http://localhost:8000/audio/` + id + '/' + localStorage.getItem('token')}
								type="audio/mpeg"
								controls
							/>
							Your browser does not support the
							<code>audio</code> element.
						</audio>
					</div>
				</div>
				<div class="col-auto d-none d-lg-block statistics">{renderBarChart}</div>
			</div>
			<table className="table">
				<thead>
					<tr>
						<th scope="col">Order</th>
						<th scope="col">Audio</th>
						<th scope="col" />
						<th scope="col">Emotion</th>
					</tr>
				</thead>
				<tbody> {audios} </tbody>
			</table>
		</div>
	);
}
