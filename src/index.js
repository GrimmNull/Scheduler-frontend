import React from 'react';
import ReactDOM from 'react-dom';
import './stylesheets/index.css';
import App from './App';

sessionStorage.setItem('logged',false)

ReactDOM.render(
    <App />,
  document.getElementById('root')
);



