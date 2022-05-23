import { React } from 'react';
import { useEffect, useState, useRef, createRef } from 'react';
import { useParams } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
export default function AudioSegment({ props, audioId }) {
	const audioOrder = props.SegmentOrder + 1
    const emotion = props.SegmentEmotion

	return (
			<tr>
				<th scope="row"> {audioOrder} </th>
				<td>
                    <audio controls preload="auto" type="audio/mpeg" className="width:20px">
						<source
							src={`http://localhost:8000/audio/segment/` + audioId + '/'+ props.SegmentOrder + '/' + localStorage.getItem('token')}
							type="audio/mpeg"
						/>
						Your browser does not support the
						<code>audio</code> element.
					</audio>
				</td>
				{(emotion == "angry" ? <td><img style={{width: "30px"}} src={process.env.PUBLIC_URL + '/alert.png'} /></td> : <td></td>)}
				{(emotion == '' ? <td>Emotion not identified yet</td> : <td>{emotion}</td>)}
			</tr>
	);
}
