import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Logged } from '../reducers/Logged';
import { Navbar, Container, Nav } from 'react-bootstrap';

import {
	CDBSidebar,
	CDBSidebarContent,
	CDBSidebarFooter,
	CDBSidebarHeader,
	CDBSidebarMenu,
	CDBSidebarMenuItem
} from 'cdbreact';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const logged = useSelector((state) => state.isLogged);
	const dispatch = useDispatch();

	return (
		<div style={{ display: 'flex', height: '100vh', overflow: 'scroll initial' }}>
			<CDBSidebar textColor="#fff" backgroundColor="#333">
				<CDBSidebarHeader prefix={<i className="fa fa-bars fa-large" />}>
					<a href="/" className="text-decoration-none" style={{ color: 'inherit' }}>
						Sidebar
					</a>
				</CDBSidebarHeader>

				<CDBSidebarContent className="sidebar-content">
					<CDBSidebarMenu>
						<NavLink exact to="/" activeClassName="activeClicked">
							<CDBSidebarMenuItem icon="columns">Dashboard</CDBSidebarMenuItem>
						</NavLink>
						<Nav.Link onClick={() => dispatch({ type: Logged.Logout })} href="/login">
                            <CDBSidebarMenuItem icon="columns">Logout</CDBSidebarMenuItem>
						</Nav.Link>
						<Nav.Link>
							<img style={{ width: '18px' }} src={process.env.PUBLIC_URL + '/bell.png'} />
						</Nav.Link>
						<NavLink exact to="/hero404" target="_blank" activeClassName="activeClicked">
							<CDBSidebarMenuItem icon="exclamation-circle">404 page</CDBSidebarMenuItem>
						</NavLink>
					</CDBSidebarMenu>
				</CDBSidebarContent>

				<CDBSidebarFooter style={{ textAlign: 'center' }}>
					<div
						style={{
							padding: '20px 5px'
						}}
					>
						Sidebar Footer
					</div>
				</CDBSidebarFooter>
			</CDBSidebar>
		</div>
	);
};

export default Sidebar;
