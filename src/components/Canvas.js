import React, {Component} from 'react';
import Puppet from './Puppet';
const WIDTH = 854, HEIGHT = 480;

class Canvas extends Component {
  
  constructor(props) {
    super(props);
    this.state = {recording: false};
    this.identies = {};
    this.chunks = [];
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
    
    Object.values(this.identies).forEach((pupet, index) => {
      const vol = pupet.vol;
      const offset = Math.abs(vol);
      const xOffset = index * 210;
      this.ctx.drawImage(this._berTop, xOffset, 186 - offset);
      this.ctx.drawImage(this._berBot, xOffset, 400 - 112);
    });
  };
  
  canvRef = c => this._canvas = c;
  
  botRef = c => this._berBot = c;
  topRef = c => this._berTop = c;
  
  volumeUpdate = ({vol, index, identity}) =>
    this.volumes[identity] = vol;
  
  remove = ({identity}) => {
    this.identies[identity].cleanUp();
    delete this.identies[identity];
  };
  
  add = ({stream, identity, isSelf}) =>
    this.identies[identity] = new Puppet({stream, identity, isSelf, volumeUpdate: this.volumeUpdate});
  
  startRecord = () => {
    try {
      const canvasStream = this._canvas.captureStream();
      
      Object.values(this.identies).forEach(puppet =>
        canvasStream.addTrack(puppet.stream.getAudioTracks()[0]));
      
      this.mediaRecorder = new window.MediaRecorder(canvasStream, {mimeType: 'video/webm; codecs=vp9'});
      this.mediaRecorder.ondataavailable = e => this.chunks.push(e.data);
      this.setState({recording: true});
      
      this.chunks = [];
      this.mediaRecorder.start();
    } catch (e2) {
      alert('MediaRecorder is not supported by this browser.\n\n' +
        'Try Firefox 29 or later, or Chrome 47 or later, with Enable experimental Web Platform features enabled from chrome://flags.');
      console.error('Exception while creating MediaRecorder:', e2);
      return;
    }
  };
  
  stopRecord = () => {
    this.setState({recording: false});
    this.mediaRecorder.stop();
    const now = new Date();
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    const blob = new Blob(this.chunks, {type: 'video/webm'}),
      url = window.URL.createObjectURL(blob);
    a.href = url;
    const name = `${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`;
    a.download = name + '.bernie.chat.webm';
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
