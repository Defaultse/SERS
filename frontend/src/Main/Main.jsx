import React from 'react';
import Item from '../Item/Item';
import { useDispatch, useSelector } from 'react-redux';
import { Logged } from '../reducers/Logged';
import { lazy, Suspense } from 'react';
import Login from './../Login/Login';

export default function Main() {

    const logged = useSelector((state) => state.isLogged);
	const dispatch = useDispatch();

    if (logged != true) {
        return (
            <>
                <h1>Login please</h1>
                <Login/>
            </>
        )
    }
    return (
        <div>
            <Item />
        </div>
    )
}