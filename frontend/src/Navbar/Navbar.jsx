import React from 'react';
import { Navbar, Container, Nav, Form, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Logged } from '../reducers/Logged';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../Navbar/Navbar.css';

export default function NavBar() {
	const logged = useSelector((state) => state.isLogged);
	const dispatch = useDispatch();

	return (
		<>
			<Navbar className="mb-0 fs-5" bg="dark" variant="dark">
				{logged == true ? (
					<Container>
						<Navbar.Brand className="mb-0 h1 fs-3" href="/">SERS</Navbar.Brand>
						<Nav className="me-auto">
							<Nav.Link href="/">Dashboard</Nav.Link>
							<Nav.Link href="/manual-upload">Manual Upload</Nav.Link>
						</Nav>
						<Nav>
							<Nav.Link style={{marginRight: "10px"}}>
								<i class="fa fa-star-o fa-lg"></i>
							</Nav.Link>
							<Nav.Link style={{marginRight: "10px"}}>
								<i class="fa fa-bell fa-lg"></i>
							</Nav.Link>
							<Nav.Link  href="/profile" style={{marginRight: "10px"}}>
								<i class="fa fa-user-circle fa-lg"></i>
							</Nav.Link>
							<Nav.Link onClick={() => dispatch({ type: Logged.Logout })} href="/login">
								Logout
							</Nav.Link>
						</Nav>
					</Container>
				) : (
					<Container>
						<Navbar.Brand className="mb-0 h1 fs-3">SERS</Navbar.Brand>
					</Container>
				)}
			</Navbar>
		    <br />
		</>
	);
}
