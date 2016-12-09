import React, {Component} from 'react';
import './App.css';
import Canvas from './views/Canvas';
import webRTCSupport from 'webrtcsupport';
import Characters from './views/Characters';
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
    this.state = {joined: false, room: false, character: false};
    this.logic = new Logic(this);
  }

  componentDidMount() {

  }

  setIdentity = identity =>
    this.setState({identity});

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

        <div style={{flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '2rem'}}>
          <div style={{textAlign: 'center'}}>Join our <a href="https://www.collaborizm.com/project/H1DQb64zg" target="_blank">Project</a> on <a href="https://www.collaborizm.com" target="_blank">Collaborizm</a>
            {" "}|{" "}&copy; Bernie.chat {new Date().getFullYear()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
