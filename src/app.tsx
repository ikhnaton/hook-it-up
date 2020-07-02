import React from 'react';
import ReactDOM from 'react-dom';
import "./app.less";

const App = () =>
{
	return (
		<div>
			Hello
		</div>
	);
};

document.addEventListener("DOMContentLoaded", () =>
{
	ReactDOM.render(
		<React.StrictMode>
			<App/>
		</React.StrictMode>,
		document.getElementById("root")
	);
});
