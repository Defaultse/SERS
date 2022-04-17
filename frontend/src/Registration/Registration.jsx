import React, { ReactElement, useState } from 'react';
import Axios from 'axios'
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import '../Login/Login.css';

export default function Registration() {
    const [username, setUsernameState] = useState('');
    const [email, setEmailState] = useState('');
    const [password, setPasswordState] = useState('');

	const handleSubmit = () => {
		console.log(username + " " + email)
        Axios.post("http://localhost:8000/profiles/create", {
            username: username,
            email: email,
            password: password
    }).then((response) => {
        window.location.replace('/login')
    });
    };

	return (
		<div className="login-body">
			<h1>Registration</h1>
			<br />

			<InputGroup className="mb-3">
				<FormControl placeholder="Your email" aria-describedby="basic-addon2" />
				<InputGroup.Text onChange={(e)=>{setEmailState(e.target.value)}} id="basic-addon2">@example.com</InputGroup.Text>
			</InputGroup>
			<InputGroup className="mb-3">
				<FormControl onChange={(e)=>{setUsernameState(e.target.value)}} placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
			</InputGroup>

			<InputGroup className="mb-3">
				<FormControl onChange={(e)=>{setPasswordState(e.target.value)}} placeholder="Password" aria-label="password" aria-describedby="basic-addon1" />
			</InputGroup>

			<InputGroup className="mb-3">
				<FormControl placeholder="Repeat Password" aria-label="password" aria-describedby="basic-addon1" />
			</InputGroup>

			<Button onClick={handleSubmit} variant="primary">Button</Button>
		</div>
	);
}
