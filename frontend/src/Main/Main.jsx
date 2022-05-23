import React from 'react';
import List from '../List/List';
import { useDispatch, useSelector } from 'react-redux';
import { Logged } from '../reducers/Logged';
import { Spinner } from 'react-bootstrap';
import { lazy, Suspense } from 'react';
import Login from './../Login/Login';
import '../List/List.css';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

export default function Main() {
	const logged = useSelector((state) => state.isLogged);
	const dispatch = useDispatch();

	const data = [
		{ name: 'Mondey', calls: 210, pv: 200, amt: 2700 },
		{ name: 'Tuesday', calls: 109, pv: 200, amt: 2700 },
		{ name: 'Wednesday', calls: 157, pv: 200, amt: 2700 },
		{ name: 'Thursday', calls: 100, pv: 200, amt: 2700 },
		{ name: 'Friday', calls: 110, pv: 200, amt: 2700 },
		{ name: 'Saturday', calls: 20, pv: 200, amt: 2700 }
	];

	const renderLineChart = (
		<LineChart className="app-container" width={500} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
			<Line type="monotone" dataKey="calls" stroke="#8884d8" />
			<CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
			<XAxis dataKey="name" />
			<YAxis />
			<Tooltip />
		</LineChart>
	);

	console.log(localStorage.getItem('token'));
	console.log(logged);
	if (logged !== true) {
		return (
			<div>
				<h1>Your are not logged. Please, log in first!</h1>
				<Login />
			</div>
		);
	}
	return (
		<div className="app-container">
			{/* <Suspense fallback={<Spinner animation="border" role="status" />}> */}
				{renderLineChart}
				<br />
				<List />
			{/* </Suspense> */}
		</div>
	);
}
