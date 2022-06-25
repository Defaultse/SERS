import { React } from 'react';
import { Accordion, FormControl, Button, Card, Nav } from 'react-bootstrap';
import { propTypes } from 'react-bootstrap/esm/Image';
import { Link, useParams } from 'react-router-dom';
import Moment from 'moment';
import AudioDetail from '../AudioDetail/AudioDetail';
import './Item.css';
import { lazy, Suspense } from 'react';

function count_angry(segments) {
	let cnt = 0;
	for (let i = 0; i < segments.length; i++) {
		if (segments[i].SegmentEmotion == 'angry') {
			cnt++;
		}
	}
	console.log(segments[0].SegmentEmotion);
	return cnt;
}

export default function List({ item }) {
	let { id } = useParams();
	let { cnt } = 0
	try {
	    cnt = count_angry(item.AudioSegments);
	} catch (error) {
		cnt = '?'
	}

	return (
		<>
		<div className="app-container">
			<Card>
				<Card.Header className="h5">{cnt} violations are identified.</Card.Header>
				<Card.Body>
					<div className="item-align-left">
						<Card.Title>Upload date: {Moment(item.UploadDate).format('LLLL')} </Card.Title>
						<audio controls preload="auto" type="audio/mpeg" className="width:20px">
							<source
								src={`http://localhost:8000/audio/` + item.id + '/' + localStorage.getItem('token')}
								type="audio/mpeg"
								controls
							/>
						Your browser does not support the
						<code>audio</code> element.
					</audio>
					{/* <Card.Text>Audio ID: {item.id}</Card.Text> */}
					</div>
					<div className="item-align-right">
						<Button
							onClick={(event) => (window.location.href = `/audio-files/` + item.id)}
							type="button"
							class="btn btn-primary w-200"
							style={{height: "6em"}}
						>
						Details
						</Button>
					</div>
				</Card.Body>
			</Card>
		</div>

		<br/>
		</>
	);
}
