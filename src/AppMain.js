import React, {Component} from 'react';
import './App.css';
import Canvas from './views/Canvas';
import webRTCSupport from 'webrtcsupport';
import Characters from './views/Characters';
import Logic from './logic/Logic';

let ids = 0;
class AppMain extends Component {

  getChildContext() {
    return {
      logic: this.logic
    };
  }

  static childContextTypes = {
    logic: React.PropTypes.instanceOf(Logic)
  };

  constructor(props) {
    super(props);

    this.state = {joined: false, room: false, character: false};
    this.logic = new Logic(this);
  }

  componentDidMount() {

  }

  setIdentity = identity => {
    this.setState({identity});
  };

  setJoinURL = ({room}) =>
    this.setState({room});

  setJoinedRoom = ({room}) =>
    this.setState({joined: room});

  refCanvas = c =>
    this._canvas = c;

  render() {
    const {room, joined, character} = this.state;

    if (!webRTCSupport.support) {
      return <div className="App" style={{padding: '4rem', textAlign: 'center'}}>
        Not supported by your browser, try <a href="https://www.google.com/chrome/">Chrome</a>!
      </div>
    }

    return (
      <div className="App" style={{display: 'flex', flexDirection: 'column'}}>

        <Characters style={{display: character ? 'none' : ''}}/>
        <Canvas style={{display: character ? '' : 'none'}} room={room} character={character} ref={this.refCanvas}/>




        {/* <iframe
         src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fbernie.chat&tabs&width=340&height=154&small_header=true&adapt_container_width=true&hide_cover=true&show_facepile=true&appId=165378603478066"
         width="340" height="154" style={{alignSelf: 'center', paddingTop: '2rem', border: 'none', overflow: 'hidden'}} scrolling="no" frameborder="0" allowTransparency="true"/>*/}

      </div>
    );
  }
}

export default AppMain;
