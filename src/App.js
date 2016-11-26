import React, {Component} from 'react';
import './App.css';
import system from './logic/twil';
import Puppet from './components/Puppet';
import Path from './views/Path';

const webRTCSupport = require('webrtcsupport');

let ids = 0;
class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {joined: false, room: false};
  }
  
  componentDidMount() {
    system.start(this);
  }
  
  puppets = [];
  
  
  removeStream = ({identity}) => {
    
    this.puppets = this.puppets.filter(puppet => puppet.key !== identity);
    console.log('removed', identity, this.puppets);
    this.setState({ids: ids++});
  };
  
  setupStream = ({stream, identity, isSelf}) => {
    console.log('setup stream in app', identity, isSelf);
    this.puppets.push(<Puppet key={identity} stream={stream} identity={identity} isSelf={isSelf}/>);
    this.setState({ids: ids++});
  };
  
  setIdentity = identity => this.setState({identity});
  
  setJoinURL = ({room}) =>
    this.setState({room});
  
  setJoinedRoom = ({room}) =>
    this.setState({joined: room});
  
  render() {
    const {room, joined} = this.state;
    
    if (!webRTCSupport.support) {
      return <div className="App" style={{padding: '4rem',textAlign:'center'}}>
        Not supported by your browser, try <a href="https://www.google.com/chrome/">Chrome</a> or <a href="https://www.mozilla.org/en-US/firefox/products/">Firefox</a>!
      </div>
    }
    
    
    return (
      <div className="App" style={{display: 'flex', flexDirection: 'column'}}>
        <Path room={room} joined={joined}/>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          {this.puppets}
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

