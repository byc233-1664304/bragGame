import { combineReducers } from "redux";
import { ProcessReducer } from "./processReducer";

const rootReducers = combineReducers({
    processReducer: ProcessReducer
});

export default rootReducers;