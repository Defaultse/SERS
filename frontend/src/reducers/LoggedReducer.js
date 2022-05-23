import { Logged } from './Logged';

const loggedReducer = (state = false, action) => {
	console.log(state)
	switch(action.type) {
		case Logged.Logout:
			localStorage.clear()
			return false;
		case Logged.Login:
			return true;
		default:
			return state;
	}
}

export default loggedReducer;
