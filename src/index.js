import React from 'react';
import ReactDOM from 'react-dom';
import './index.sass';
import AppContainer from './containers/AppContainer';
import * as serviceWorker from './serviceWorker';
import NotificationActions from './data/NotificationActions';
window.NotificationActions = NotificationActions;

ReactDOM.render(<AppContainer />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
