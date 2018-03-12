import React from 'react';
import { BrowserRouter as Router, Route, browserHistory, Layout, Switch, Redirect } from 'react-router-dom'

import App from './App';
import Login from './login';
import Signup from './signup';

const AppRouter = () =>(
	<Router>
		<div>
			<Switch>
				<Route exact path="/" component={App}/>
				<Route path="/login" component={Login}/>
				<Route path="/signup" component={Signup}/>
			</Switch>
		</div>
	</Router>
)

export default AppRouter;