import React from 'react';
import Path from './Path';
import Component from '../components/Component';

const WIDTH = 854, HEIGHT = 480, BACKGROUND = '#062945';

export default class Canvas extends Component {

  constructor(props) {
    super(props);
    this.state = {recording: false};
    this.identies = {};
    this.chunks = [];
  }

  componentDidMount() {
    this.ctx = this._canvas.getContext('2d');
    this.ctx.fillStyle = BACKGROUND;
    this.ctx.fillRect(0, 0, WIDTH, HEIGHT);

    this.canvasStream = this._canvas.captureStream();
    this.mediaRecorder = new window.MediaRecorder(this.canvasStream, {mimeType: 'video/webm; codecs=vp9'});
    this.mediaRecorder.ondataavailable = e => this.chunks.push(e.data);

    this.startAnimate();
  }

  startAnimate = () => {
    this._animationFrame = window.requestAnimationFrame(this.startAnimate);
    this.ctx.fillStyle = BACKGROUND;
    this.ctx.fillRect(0, 0, WIDTH, HEIGHT);


    const LOGO_WIDTH = 423.66, LOGO_HEIGHT = 27.93;
    const identities = Object.values(this.logic.identies);

    identities.forEach((pupet, index) => {

      const {character} = pupet;

      if (!character)
        return;

      const {splitPoint, height, width} = character;

      // console.log('pupet.width', pupet);
      const
        count = identities.length,
        QUAD = WIDTH / (count === 1 ? 2 : identities.length),
        destWidth = character.width > QUAD ? QUAD : character.width,
        resize = (destWidth / character.width),
        destHeight = resize * character.height,
        splitPointResized = splitPoint * resize,
        half = (QUAD * (count === 1 ? 1 : index)) + (count === 1 ? (destWidth / -2) : (QUAD - destWidth) / 2);

      const
        img = pupet.character.ref,
        vol = pupet.vol,
        xOffset = half;

      let offset = vol - 1;

      if (offset < 0)
        offset = 0;

      const zero = HEIGHT - (destHeight);

      const params = {
        img,
        sx: 0,
        sy: 0,
        sw: width,
        sh: splitPoint,
        dx: xOffset,
        dy: zero - offset,
        dw: destWidth,
        dh: splitPointResized
      };

      const params2 = {
        img,
        sx: 0,
        sy: splitPoint,
        sw: width,
        sh: height - splitPoint,
        dx: xOffset,
        dy: splitPointResized + zero,
        dw: destWidth,
        dh: (destHeight) - (splitPointResized)
      };

      this.ctx.drawImage(...Object.values(params));
      this.ctx.drawImage(...Object.values(params2));
      const cornerOffset = 10;
      this.ctx.drawImage(this._logo, WIDTH - (LOGO_WIDTH + cornerOffset), HEIGHT - (LOGO_HEIGHT + cornerOffset), LOGO_WIDTH, LOGO_HEIGHT);
    });
  };

  canvRef = c => this._canvas = c;
  logoRef = c => this._logo = c;

  startRecord = () => {
    this.setState({recording: true});


    Object.values(this.logic.identies).forEach((pupet, index) => {
      const audioTracks = pupet.stream.getAudioTracks();
      if (audioTracks.length > 0)
        this.canvasStream.addTrack(pupet.stream.getAudioTracks()[0]);
    });

    this.chunks = [];
    this.mediaRecorder.start();
  };

  stopRecord = () => {
    this.setState({recording: false});
    this.mediaRecorder.stop();

    this.canvasStream.getAudioTracks().forEach(track => this.canvasStream.removeTrack(track));

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

    return <div style={{...this.props.style, flexDirection: 'column', alignItems: 'center'}}>
      <Path room={room}/>
      <div style={{display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'column',}}>
        <canvas width={WIDTH} height={HEIGHT} ref={this.canvRef}/>
        <div style={{display: 'flex', justifyContent: 'center', padding: '1rem'}}>
          {!recording ?
            <button onClick={this.startRecord}>Start Record</button> :
            <button onClick={this.stopRecord}>Stop Recording</button>}
          &nbsp;|&nbsp;
          <button onClick={this.logic.changeMyCharacter}>Change My Character</button>
          <img src='/logo.svg' ref={this.logoRef} style={{display: ''}}/>
        </div>
      </div>
    </div>;
  }
}


