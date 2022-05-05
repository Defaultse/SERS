import { React } from 'react';
import { Accordion, FormControl, Button } from 'react-bootstrap';
import { propTypes } from 'react-bootstrap/esm/Image';
import ItemSegment from './ItemSegment';
import '../List/List.css';

export default function List({ item }) {
	// console.log(item.AudioSegments)

	const segments = item.AudioSegments.map((segment) => <ItemSegment props={segment} />);

	return (
		<div className="app-container">
			<Accordion.Item>
				<Accordion.Header>Audio ID: {item.id}</Accordion.Header>
				<Accordion.Body>
					<h3>Upload date: {item.UploadDate}</h3>
					<audio controls preload="auto" type="audio/mpeg" className="width:20px">
						<source
							src={`http://localhost:8000/audiofiles/` + item.id + '/' + localStorage.getItem('token')}
							type="audio/mpeg"
						/>
						Your browser does not support the
						{/* <code>audio</code> element. */}
					</audio>
					<table class="table">
						<thead>
							<tr>
								<th scope="col">#</th>
								<th scope="col">Order</th>
								<th scope="col">Audio</th>
								<th scope="col">Emotion</th>
							</tr>
						</thead>
						<tbody>{segments}</tbody>
					</table>
					<br />
				</Accordion.Body>
			</Accordion.Item>
		</div>
	);
}
