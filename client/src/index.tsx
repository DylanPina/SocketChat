import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./redux/store";

import "./styles/index.css";

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL ?? "";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
	<React.StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</Provider>
	</React.StrictMode>
);
