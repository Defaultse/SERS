import { React } from 'react';
import { Accordion, FormControl, Button } from 'react-bootstrap';

export default function List() {
	return (
		<Accordion.Item eventKey="2">
			<Accordion.Header>Audio null</Accordion.Header>
			<Accordion.Body>
				<h3>Null</h3>
				<audio controls preload="auto" type="audio/mpeg" className="width:20px">
					<source src={`http://localhost:8000/test`} type="audio/mpeg" />
					Your browser does not support the
					{/* <code>audio</code> element. */}
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
									<source
										src={``}
										type="audio/mpeg"
									/>
									Your browser does not support the
									{/* <code>audio</code> element. */}
								</audio>
							</td>
							<td>Angry</td>
						</tr>
						<tr>
							<th scope="row">2</th>
							<td>2</td>
							<td>
								<audio controls preload="auto" type="audio/mpeg">
									<source
										src={``}
										type="audio/mpeg"
									/>
									Your browser does not support the
									{/* <code>audio</code> element. */}
								</audio>
							</td>
							<td>Neutral</td>
						</tr>
					</tbody>
				</table>
                <br />
			</Accordion.Body>
		</Accordion.Item>
	);
}
