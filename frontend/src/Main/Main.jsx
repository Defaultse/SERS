import React, { useEffect, useState, useRef, createRef } from 'react';
import List from '../List/List';
import { useDispatch, useSelector } from 'react-redux';
import { Logged } from '../reducers/Logged';
import { Spinner } from 'react-bootstrap';
import { lazy, Suspense } from 'react';
import Login from './../Login/Login';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import Axios from 'axios';

export default function Main() {
	const dispatch = useDispatch();

	const instance = Axios.create({
		baseURL: 'http://localhost:8000/checkToken',
		timeout: 1000,
		headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
	});

	useEffect(() => {
		instance.post('').then((response) => {
			if (response.data == 401) {
				dispatch({ type: Logged.Logout })
				localStorage.clear()
			}
		});
	}, []);


	const data = [
		{ name: 'Monday', calls: 210, pv: 200, amt: 2700 },
		{ name: 'Tuesday', calls: 109, pv: 200, amt: 2700 },
		{ name: 'Wednesday', calls: 157, pv: 200, amt: 2700 },
		{ name: 'Thursday', calls: 100, pv: 200, amt: 2700 },
		{ name: 'Friday', calls: 110, pv: 200, amt: 2700 },
		{ name: 'Saturday', calls: 20, pv: 200, amt: 2700 }
	];

	const renderLineChart = (
		<LineChart className="app-container" width={900} height={400} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
			<Line type="monotone" dataKey="calls" stroke="#8884d8" />
			<CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
			<XAxis dataKey="name" />
			<YAxis />
			<Tooltip />
		</LineChart>
	);


	const logged = useSelector((state) => state.isLogged);
	if (logged !== true) {
		return (
			<div className="app-container">
				<Login />
			</div>
		);
	}
	return (
		<div className="app-container">
				{renderLineChart}
				<br />
				<br />
				<List />
		</div>
	);
}
