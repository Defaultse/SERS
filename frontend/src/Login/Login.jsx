import React, { ReactElement, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Logged } from '../reducers/Logged';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import Axios from 'axios';
import './Login.css';

export default function Login() {
	const [ username, setUsernameState ] = useState('');
	const [ email, setEmailState ] = useState('');
	const [ password, setPasswordState ] = useState('');
	const dispatch = useDispatch();

	const handleSubmit = () => {
		Axios.post('http://localhost:8000/profiles/login', {
			username: username,
			email: email,
			password: password
		}).then((response) => {
			console.log(response);
			localStorage.setItem('token', response.data);
			window.location.replace('/');
			dispatch({ type: Logged.Login });
		});
	};

	return (
		<div className="login-body">
			<h1>Login Form</h1>
			<br />
			<InputGroup className="mb-3">
				<FormControl
					onChange={(e) => {
						setUsernameState(e.target.value);
					}}
					placeholder="Username"
					aria-label="Username"
					aria-describedby="basic-addon1"
				/>
			</InputGroup>

			{/* <InputGroup className="mb-3">
				<FormControl
					placeholder="Your email"
					aria-describedby="basic-addon2"
				/>
				<InputGroup.Text id="basic-addon2">@example.com</InputGroup.Text>
			</InputGroup> */}

			<InputGroup className="mb-3">
				<FormControl
					onChange={(e) => {
						setPasswordState(e.target.value);
					}}
					placeholder="Password"
					aria-label="password"
					aria-describedby="basic-addon1"
				/>
			</InputGroup>

			<Button onClick={handleSubmit} variant="primary">
				Button
			</Button>

			{/* <b/> */}

			<a href="/registration">No profile yet?</a>
		</div>
	);
}
