import React, { ReactElement } from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import './Login.css';

export default function Login() {
	return (
		<div className="login-body">
			<h1>Login Form</h1>
			<br />
			<InputGroup className="mb-3">
				<FormControl placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
			</InputGroup>

			{/* <InputGroup className="mb-3">
				<FormControl
					placeholder="Your email"
					aria-describedby="basic-addon2"
				/>
				<InputGroup.Text id="basic-addon2">@example.com</InputGroup.Text>
			</InputGroup> */}

			<InputGroup className="mb-3">
				<FormControl placeholder="Password" aria-label="password" aria-describedby="basic-addon1" />
			</InputGroup>

            <Button variant="primary">Button</Button>
		</div>
	);
}
