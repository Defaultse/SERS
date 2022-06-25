import React, { ReactElement, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Logged } from '../reducers/Logged';
import { InputGroup, FormControl, Button, Form, Modal } from 'react-bootstrap';
import Axios from 'axios';
import './ManualUpload.css'

export default function ManualUpload() {
	const [ selectedFile, setSelectedFile ] = useState(null);
	const [ successUpload, setSuccessUpload ] = useState('');
	const [ modal, setModal] = useState([]);

	const handleSubmit = (event) => {
		event.preventDefault();
		const formData = new FormData();
		formData.append('audio', selectedFile);
		Axios.post('http://localhost:8000/audio/upload', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: 'Bearer ' + localStorage.getItem('token')
			}
		}).then((response) => {
			console.log(response)
			if (response.status == 200) {
				setModal(
					<Modal.Dialog>
						<Modal.Header closeButton>
							<Modal.Title>Success!</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<p>{selectedFile.name} uploaded successfully!</p>
							<p>Audio recording is going to be analyzed very soon.</p>
						</Modal.Body>
					</Modal.Dialog>
				);
			} else {
				setModal(<></>)
			}
		});
	};

	const handleFileSelect = (event) => {
		setSelectedFile(event.target.files[0]);
		console.log(event.target.files[0].name)
	};

	return (
		<div className="upload-container">
			<h1>Manual Upload</h1>
			<br />
			{modal}
			<Form.Group controlId="formFile" className="mb-3" onSubmit={handleSubmit}>
				{/* <Form.Label>Default file input example</Form.Label> */}
				<Form.Control type="file" onChange={handleFileSelect} />
			</Form.Group>
			<Button variant="primary" type="submit" value="Upload file" onClick={handleSubmit}>
				Button
			</Button>
		</div>
	);
}
