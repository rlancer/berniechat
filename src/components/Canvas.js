import React, {Component} from 'react';

const WIDTH = 854, HEIGHT = 480;

class Canvas extends Component {
  
  constructor(props) {
    super(props);
    this.state = {recording: false};
  }
  
  componentDidMount() {
    this.ctx = this._canvas.getContext('2d');
    this.ctx.fillStyle = "#f00";
    this.ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }
  
  canvRef = c => this._canvas = c;
  botRef = c => this._berBot = c;
  topRef = c => this._berTop = c;
  
  componentWillUnmount() {
    
  }
  
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
