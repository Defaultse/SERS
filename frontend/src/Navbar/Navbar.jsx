import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Logged } from '../reducers/Logged';
// import 'bootstrap/dist/css/bootstrap.min.css';

export default function NavBar() {
	const logged = useSelector((state) => state.isLogged);
	const dispatch = useDispatch();

	return (
		<>
		<Navbar bg="dark" variant="dark">
			{logged == true ? (
				<Container className="app-container">
					<Navbar.Brand>SERS</Navbar.Brand>
					<Nav className="container-fluid">
						<Nav.Link href="/">Main</Nav.Link>
						<Nav.Link onClick={()=>dispatch({type: Logged.Logout})} href="/login" >Logout</Nav.Link>
						<Nav.Link><img style={{width: "18px"}} src={process.env.PUBLIC_URL + '/bell.png'} /></Nav.Link>
					</Nav>
				</Container>
			) : (
				<Container>
					<Navbar.Brand>SERS</Navbar.Brand>
				</Container>
			)}
		</Navbar>
		<br/>
		</>
	);
}
