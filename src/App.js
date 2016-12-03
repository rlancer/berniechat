import React, {Component} from 'react';
import './App.css';
import system from './logic/twil';
import Path from './views/Path';
import Canvas from './components/Canvas';
import webRTCSupport from 'webrtcsupport';
import Characters from './components/Characters';
import Logic from './logic/Logic';

let ids = 0;
class App extends Component {
  
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
    this.state = {
      joined: false,
      room: false,
      character: false
    };
    this.logic = new Logic(this);
  }
  
  componentDidMount() {
    system.start(this);
  }
  
  removeStream = ({
    identity
  }) => {
    this._canvas.remove({
      identity
    });
  };
  
  setupStream = ({stream, identity, isSelf}) => {
    this._canvas.add({
      stream,
      identity,
      isSelf
    });
  };
  
  setIdentity = identity => this.setState({
    identity
  });
  
  setJoinURL = ({
    room
  }) =>
    this.setState({
      room
    });
  
  setJoinedRoom = ({
    room
  }) =>
    this.setState({
      joined: room
    });
  
  refCanvas = c => this._canvas = c;
  
  render() {
    const {
      room,
      joined,
      character
    } = this.state;
    
    if (!webRTCSupport.support) {
      return <div className="App" style={{padding: '4rem', textAlign: 'center'}}>
        Not supported by your browser, try <a href="https://www.google.com/chrome/">Chrome</a> or <a href="https://www.mozilla.org/en-US/firefox/products/">Firefox</a>!
      </div>
    }
    
    return (
      <div className="App" style={{display: 'flex', flexDirection: 'column'}}>
        <Path room={room} joined={joined}/>
        <div style={{display: character ? 'none' : ''}}>
          <Characters/>
        </div>
        <div style={{display: character ? '' : 'none'}}>
          <Canvas character={character} ref={this.refCanvas}/>
        </div>
        <div style={{flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '2rem'}}>
          <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
            <div>Join our <a href="https://www.collaborizm.com/project/H1DQb64zg" target="_blank">Project</a> on <a href="https://www.collaborizm.com" target="_blank">Collaborizm</a></div>
            <div>&copy; BernieChat.com {new Date().getFullYear()}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
