import React, {Component} from 'react';

const WIDTH = 230, HEIGHT = 400;

var chunks = [];


class Puppet extends Component {
  
  constructor(props) {
    super(props);
  }
  
  
  componentDidMount() {
    const {stream, identity, isSelf} = this.props;
    
    if (!isSelf) {
      this._video.src = window.URL.createObjectURL(stream);
      this._video.play();
    }
    
    this.setupAudio(stream);
    
    this._berBot.onload = () => {
      this.ctx = this._canvas.getContext('2d');
      
      this.ctx.fillStyle = "blue";
      this.ctx.fillRect(0, 0, WIDTH, HEIGHT);
      
      this.ctx.drawImage(this._berTop, 0, 0);
      this.ctx.drawImage(this._berBot, 0, 102);
      
      this.startAnimate();
    };
    
    const canvasStream = this._canvas.captureStream();
    const mediaRecorder = new window.MediaRecorder(canvasStream, {mimeType: 'video/webm; codecs=vp9'});
    
    mediaRecorder.ondataavailable = e => chunks.push(e.data);
    
    
    mediaRecorder.start();
    
    window.setTimeout(() => {
      mediaRecorder.stop();
      
      ////////////
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      
      const
        blob = new Blob(chunks, {
          type: 'video/webm'
        }),
        url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = 'recording.webm';
      a.click();
      window.URL.revokeObjectURL(url);
      
      
      /////////////
      
      
    }, 4000);
  }
  
  setupAudio = stream => {
    const sampleSize = 256;
    const audioContext = new window.AudioContext();
    const sourceNode = audioContext.createMediaStreamSource(stream);
    
    const analyserNode = audioContext.createAnalyser();
    const javascriptNode = audioContext.createScriptProcessor(sampleSize, 1, 1);
    // Create the array for the data values
    let amplitudeArray = new Uint8Array(analyserNode.frequencyBinCount);
    // setup the event handler that is triggered every time enough samples have been collected
    // trigger the audio analysis and draw one column in the display based on the results
    let ids = 0;
    
    javascriptNode.onaudioprocess = () => {
      amplitudeArray = new Uint8Array(analyserNode.frequencyBinCount);
      analyserNode.getByteTimeDomainData(amplitudeArray);
      
      let minValue = 9999999;
      let maxValue = 0;
      
      for (let i = 0; i < amplitudeArray.length; i++) {
        
        let value = amplitudeArray[i];
        if (value > maxValue) {
          maxValue = value;
        } else if (value < minValue) {
          minValue = value;
        }
      }
      
      this.vol = (maxValue - minValue);
    };
    // Now connect the nodes together
    // Do not connect source node to destination - to avoid feedback
    sourceNode.connect(analyserNode);
    analyserNode.connect(javascriptNode);
    javascriptNode.connect(audioContext.destination);
  };
  
  canvRef = c => this._canvas = c;
  botRef = c => this._berBot = c;
  topRef = c => this._berTop = c;
  
  i = 0;
  startAnimate = () => {
    this._animationFrame = window.requestAnimationFrame(this.startAnimate);
    this.ctx.fillStyle = '#f00';
    this.ctx.fillRect(0, 0, WIDTH, HEIGHT);
    const offset = Math.abs(this.vol);
    this.ctx.drawImage(this._berTop, 0, 186 - offset);
    this.ctx.drawImage(this._berBot, 0, 400 - 112);
  };
  
  componentWillUnmount() {
    window.cancelAnimationFrame(this._animationFrame);
  }
  
  refTxt = c => this._txt = c;
  refCb = c => this._cb = c;
  refVideo = c => this._video = c;
  
  render() {
    return (
      <div>
        <video style={{display: 'none'}} ref={this.refVideo}/>
        <div style={{display: 'none', flexDirection: 'column'}}>
          <img src="/bern_top.png" ref={this.topRef}/>
          <img src="/bern_bot.png" ref={this.botRef}/>
        </div>
        <canvas width="230" height="400" ref={this.canvRef}/>
      </div>
    );
  }
}


export default Puppet;
