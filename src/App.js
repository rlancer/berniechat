import React, {Component} from 'react';
import './App.css';
import system from './logic/system';

const WIDTH = 578, HEIGHT = 400;

class App extends Component {

  setupAudio = stream=> {

    window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

    const sampleSize = 256;
    const audioContext = new window.AudioContext();
    const sourceNode = audioContext.createMediaStreamSource(stream);
    const audioStream = stream;
    const analyserNode = audioContext.createAnalyser();
    const javascriptNode = audioContext.createScriptProcessor(sampleSize, 1, 1);
    // Create the array for the data values
    let amplitudeArray = new Uint8Array(analyserNode.frequencyBinCount);
    // setup the event handler that is triggered every time enough samples have been collected
    // trigger the audio analysis and draw one column in the display based on the results
    let ids = 0;
    javascriptNode.onaudioprocess = ()=> {
      amplitudeArray = new Uint8Array(analyserNode.frequencyBinCount);
      analyserNode.getByteTimeDomainData(amplitudeArray);

      var minValue = 9999999;
      var maxValue = 0;

      for (let i = 0; i < amplitudeArray.length; i++) {
        var value = amplitudeArray[i];
        if (value > maxValue) {
          maxValue = value;
        } else if (value < minValue) {
          minValue = value;
        }
      }

      this.vol = (maxValue - minValue);

      // draw one column of the display
      // requestAnimFrame(drawTimeDomain);
    };
    // Now connect the nodes together
    // Do not connect source node to destination - to avoid feedback
    sourceNode.connect(analyserNode);
    analyserNode.connect(javascriptNode);
    javascriptNode.connect(audioContext.destination);
  };

  listen = ()=> {

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    navigator.getUserMedia({audio: true, video: false},

      (stream) => {
        console.log(stream, this);
        this.setupAudio(stream);
      }
      , err=>console.error(err));
  };

  canvRef = c => this._canvas = c;
  botRef = c => this._berBot = c;
  topRef = c => this._berTop = c;

  componentDidMount() {
    this._berBot.onload = () => {
      this.ctx = this._canvas.getContext('2d');
      this.ctx.drawImage(this._berTop, 0, 0);
      this.ctx.drawImage(this._berBot, 0, 102);
      console.log('bern loaded');
      this.startAnimate();

    };
    this.listen();
  }

  i = 0;
  startAnimate = ()=> {
    window.requestAnimationFrame(this.startAnimate);

    this.ctx.clearRect(0, 0, WIDTH, HEIGHT);


    const offset = Math.abs(this.vol);
    this.ctx.drawImage(this._berTop, 0, 10 - (offset));
    this.ctx.drawImage(this._berBot, 0, 112);
  };

  refTxt = c => this._txt = c;
  refCb = c => this._cb = c;


  render() {
    return (
      <div className="App">
        <div style={{display: 'none', flexDirection: 'column'}}>
          <img src="/bern_top.png" ref={this.topRef}/>
          <img src="/bern_bot.png" ref={this.botRef}/>
        </div>
        <canvas width="578" height="400" ref={this.canvRef}/>
        <div>
          <hr/>
          <hr/>
        </div>
      </div>
    );
  }
}


/*
let _peer1 = false;
let _peer2 = false;

var SimplePeer = require('simple-peer');

var peer1 = new SimplePeer({initiator: true});
var peer2 = new SimplePeer({});

peer1.on('signal', function (data) {

  if (!_peer1) {
    _peer1 = true;
    return;
  }

  // when peer1 has signaling data, give it to peer2 somehow
  console.log('signal from 1', data);
  peer2.signal(data);
});

peer2.on('signal', function (data) {

  if (!_peer2) {
    _peer2 = true;
    return;
  }

  // when peer2 has signaling data, give it to peer1 somehow
  console.log('signal from 2', data);
  peer1.signal(data);
});

peer1.on('connect', function () {
  // wait for 'connect' event before using the data channel
  peer1.send('hey peer2, how is it going?');
});

peer2.on('data', function (data) {

  // got a data channel message
  console.log('got a message from peer1: ' + data);
});
*/

export default App;
