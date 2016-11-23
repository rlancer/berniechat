import React, {Component} from 'react';

const WIDTH = 578, HEIGHT = 400;

class Puppet extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {stream, identity} = this.props;

    console.log('is self', identity);
    // if (!isSelf) {
      console.log('SETUfP STREAM TO PLAY', this._video);
      this._video.src = window.URL.createObjectURL(stream);
      this._video.play();
    // }
    this.setupAudio(stream);

    this._berBot.onload = () => {
      this.ctx = this._canvas.getContext('2d');
      this.ctx.drawImage(this._berTop, 0, 0);
      this.ctx.drawImage(this._berBot, 0, 102);
      console.log('bern loaded');
      this.startAnimate();
    };
  }

  setupAudio = stream=> {
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

    if (!this.props.isSelf) {
      console.log('analyserNode', analyserNode);
    }

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

      /*if (!this.props.isSelf) {
       console.log('vol', this.vol);
       }
       */
      // draw one column of the display
      // requestAnimFrame(drawTimeDomain);
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
  startAnimate = ()=> {
    window.requestAnimationFrame(this.startAnimate);
    this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
    const offset = Math.abs(this.vol);
    this.ctx.drawImage(this._berTop, 0, 10 - (offset));
    this.ctx.drawImage(this._berBot, 0, 112);
  };

  refTxt = c => this._txt = c;
  refCb = c => this._cb = c;
  refVideo = c => this._video = c;

  render() {
    const {stream, isSelf} = this.props;


    return (
      <div>
        {!isSelf ? <video ref={this.refVideo}/> : false}
        <div style={{display: 'none', flexDirection: 'column'}}>
          <img src="/bern_top.png" ref={this.topRef}/>
          <img src="/bern_bot.png" ref={this.botRef}/>
        </div>
        <canvas width="578" height="400" ref={this.canvRef}/>
      </div>
    );
  }
}

export default Puppet;
