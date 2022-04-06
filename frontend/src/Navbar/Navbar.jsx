import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';

export default function NavBar() {
	return (
		<Navbar bg="dark" variant="dark">
			<Container className="">
				<Navbar.Brand>Voice-Patrol</Navbar.Brand>
				<Nav className="container-fluid">
					<Nav.Link>Main</Nav.Link>
					<Nav.Link>Logout</Nav.Link>
				</Nav>
			</Container>
		</Navbar>
	);
}
