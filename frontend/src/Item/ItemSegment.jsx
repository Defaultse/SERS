import { React } from 'react';
import { Accordion, FormControl, Button } from 'react-bootstrap';
import { propTypes } from 'react-bootstrap/esm/Image';

export default function ItemSegment({ props }) {
	console.log(props);
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
	// const list = audioList.map((item) => );
    var filePath = props.SegmentFilePath

	return (
		<tr>
			<th scope="row" />
			<td>{props.SegmentOrder}</td>
			<td>
				<audio src={filePath} controls preload="auto" type="audio/mpeg">
					<source src={filePath} type="audio/mpeg" />
				</audio>
			</td>
			{(props.SegmentEmotion = '' ? <td>{props.SegmentEmotion}</td> : <td>Emotion not identified yet</td>)}
		</tr>
	);
}
