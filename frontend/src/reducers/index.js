import { combineReducers } from "redux";
import { persistReducer } from "redux-persist"
import storage from "redux-persist/es/storage";
import loggedReducer from "./LoggedReducer";

var persistConfig = {
    key: 'root',
    storage,
    whitelist: ['isLogged']
};
var allReducers = combineReducers({
    isLogged: loggedReducer,
});


export default persistReducer(persistConfig, allReducers);