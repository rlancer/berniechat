import React, {Component} from 'react';

const WIDTH = 230, HEIGHT = 400;


class Canvas extends Component {
  
  constructor(props) {
    super(props);
    this.state = {recording: false};
  }
  
  componentDidMount() {
    
    
  }
  
  canvRef = c => this._canvas = c;
  botRef = c => this._berBot = c;
  topRef = c => this._berTop = c;
  
  i = 0;
  startAnimate = () => {
    this._animationFrame = window.requestAnimationFrame(this.startAnimate);
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(0, 0, WIDTH, HEIGHT);
    const offset = Math.abs(this.vol);
    this.ctx.drawImage(this._berTop, 0, 186 - offset);
    this.ctx.drawImage(this._berBot, 0, 400 - 112);
  };
  
  componentWillUnmount() {
    window.cancelAnimationFrame(this._animationFrame);
  }
  
  refVideo = c => this._video = c;
  
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
        <video style={{display: 'none'}} ref={this.refVideo}/>
        <div style={{display: 'none', flexDirection: 'column'}}>
          <img src="/bern_top.png" ref={this.topRef}/>
          <img src="/bern_bot.png" ref={this.botRef}/>
        </div>
        <canvas width="230" height="400" ref={this.canvRef}/>
        <div>
          {!recording ?
            <button onClick={this.startRecord}>Start Record</button> : <button onClick={this.stopRecord}>Stop Recording</button>}
        </div>
      </div>
    );
  }
}


export default Canvas;
