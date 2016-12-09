import React from 'react';
import Path from './Path';
import Component from '../components/Component';

const WIDTH = 854, HEIGHT = 480;

export default class Canvas extends Component {
  
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
    
    const canvasStream = this._canvas.captureStream();
    this.mediaRecorder = new window.MediaRecorder(canvasStream, {mimeType: 'video/webm; codecs=vp9'});
    this.mediaRecorder.ondataavailable = e => this.chunks.push(e.data);
    
    this.startAnimate();
  }
  
  startAnimate = () => {
    this._animationFrame = window.requestAnimationFrame(this.startAnimate);
    this.ctx.fillStyle = '#0ff';
    this.ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    Object.values(this.logic.identies).forEach((pupet, index) => {
      
      if (!pupet.character)
        return;
      
      const
        img = pupet.character.ref,
        vol = pupet.vol,
        
        xOffset = index * 330;
      
      let offset = vol - 1;
      
      if (offset < 0)
        offset = 0;
      
      const {splitPoint, height, width} = pupet.character;
      
      const zero = HEIGHT - height;
      
      const params = {
        img,
        sx: 0,
        sy: 0,
        sw: width,
        sh: splitPoint,
        dx: xOffset,
        dy: zero - offset,
        dw: width,
        dh: splitPoint
      };
      
      const params2 = {
        img,
        sx: 0,
        sy: splitPoint,
        sw: width,
        sh: height - splitPoint,
        dx: xOffset,
        dy: splitPoint + zero,
        dw: width,
        dh: height - splitPoint
      };
      
      this.ctx.drawImage(...Object.values(params));
      this.ctx.drawImage(...Object.values(params2));
    });
  };
  
  canvRef = c => this._canvas = c;
  
  botRef = c => this._berBot = c;
  topRef = c => this._berTop = c;
  
  volumeUpdate = ({vol, index, identity}) =>
    this.volumes[identity] = vol;
  
  startRecord = () => {
    this.setState({recording: true});
    this.chunks = [];
    this.mediaRecorder.start();
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
    
    const
      {recording} = this.state,
      {room} = this.props;
    
    return <div style={{flex: 1, ...this.props.style}}>
      <Path room={room}/>
      
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <canvas width={WIDTH} height={HEIGHT} ref={this.canvRef}/>
      </div>
      <div style={{display: 'flex', justifyContent: 'center', padding: '1rem'}}>
        {!recording ?
          <button onClick={this.startRecord}>Start Record</button> :
          <button onClick={this.stopRecord}>Stop Recording</button>}
      </div>
    </div>;
  }
}


