import { Logged } from './Logged';

var loggedReducer = function(state, action) {
	state = false;

	switch (action.type) {
		case Logged.Login:
			return true;
		case Logged.Logout:
			return false;
		default:
			return state;
	}
};

export default loggedReducer;
