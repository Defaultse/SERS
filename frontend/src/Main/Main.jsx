import React from 'react';
import List from '../List/List';
import { useDispatch, useSelector } from 'react-redux';
import { Logged } from '../reducers/Logged';
import { Spinner } from 'react-bootstrap';
import { lazy, Suspense } from 'react';
import Login from './../Login/Login';

export default function Main() {
	const logged = useSelector((state) => state.isLogged);
	const dispatch = useDispatch();

	if (logged != true) {
		return (
			<div>
				<h1>Your are not logged. Please, log in first!</h1>
				<Login />
			</div>
		);
	}
	return (
		<div>
			<Suspense fallback={<Spinner animation="border" role="status" />}>
				<List />
			</Suspense>
		</div>
	);
}
