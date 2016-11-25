import React, {Component} from 'react';
import './App.css';
import system from './logic/twil';
import Puppet from './components/Puppet';
// import Peer from 'peerjs';
let ids = 0;
class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {joinUrl: false, hasSelf: false, hasOther: false, identity: false};
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
  
  setJoinURL = joinUrl =>
    this.setState({joinUrl});
  
  render() {
    const {joinUrl, hasSelf, hasOther, identity} = this.state;
    
    return (
      <div className="App">
        <div style={{backgroundColor: '#fff', padding: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <h1 style={{color: '#333'}}>BernieChat.com</h1>
        </div>
        <div style={{height: '20rem'}}>
          {this.puppets}
        </div>
      </div>
    );
  }
}

export default App;

