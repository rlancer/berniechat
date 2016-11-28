import React, {Component} from 'react';
import puppet from './puppet';
const WIDTH = 854, HEIGHT = 480;

class Canvas extends Component {
  
  constructor(props) {
    super(props);
    this.state = {recording: false};
    this.identies = [];
    this.vol = 10;
  }
  
  componentDidMount() {
    this.ctx = this._canvas.getContext('2d');
    this.ctx.fillStyle = "#f00";
    this.ctx.fillRect(0, 0, WIDTH, HEIGHT);
    this.startAnimate();
  }
  
  startAnimate = () => {
    this._animationFrame = window.requestAnimationFrame(this.startAnimate);
    this.ctx.fillStyle = '#0ff';
    this.ctx.fillRect(0, 0, WIDTH, HEIGHT);
    const offset = Math.abs(this.vol);
    this.ctx.drawImage(this._berTop, 0, 186 - offset);
    this.ctx.drawImage(this._berBot, 0, 400 - 112);
    console.log('Start animate', this.vol);
  };
  
  canvRef = c => this._canvas = c;
  botRef = c => this._berBot = c;
  topRef = c => this._berTop = c;
  
  volumeUpdate = ({vol, index, identity}) => {
    console.log('VOLUME IDENTITY', vol, index, identity);
  };
  
  add = ({stream, identity, isSelf}) => {
    const index = this.identies.length;
    this.identies.push(identity);
    puppet({index, stream, identity, isSelf, volumeUpdate: this.volumeUpdate});
  };
  
  startRecord = () => {
    this.setState({recording: true});
    this.chunks = [];
    this.mediaRecorder.start();
  };
  
  stopRecord = () => {
    this.setState({recording: false});
    this.mediaRecorder.stop();
    
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    const blob = new Blob(this.chunks, {type: 'video/webm'}),
      url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = 'recording.webm';
    a.click();
    window.URL.revokeObjectURL(url);
  };
  
  render() {
    const {recording} = this.state;
    
    return (
      <div>
        <div style={{display: 'none', flexDirection: 'column'}}>
          <img src="/bern_top.png" ref={this.topRef}/>
          <img src="/bern_bot.png" ref={this.botRef}/>
        </div>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <canvas width={WIDTH} height={HEIGHT} ref={this.canvRef}/>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', padding: '1rem'}}>
          {!recording ?
            <button onClick={this.startRecord}>Start Record</button> :
            <button onClick={this.stopRecord}>Stop Recording</button>}
        </div>
      </div>
    );
  }
}


export default Canvas;
