import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

// handle prefixes
window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

