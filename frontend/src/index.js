import React from 'react';
import ReactDOM from 'react-dom/client';
import { createStore } from "redux";
import { Provider } from "react-redux";
import './index.css';
import App from './App';
import rootReducers from "./services/store/reducer";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";

if(process.env.REACT_APP_NODE_ENV === "production") {
  disableReactDevTools();
}

const root = ReactDOM.createRoot(document.getElementById('root'));
const store = createStore(rootReducers);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
