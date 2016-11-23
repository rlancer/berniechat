import React, {Component} from 'react';
import './App.css';
import system from './logic/twil';
import Puppet from './components/Puppet';
// import Peer from 'peerjs';

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {joinUrl: false, hasSelf: false, hasOther: false};
  }
  
  componentDidMount() {
    system.start(this);
  }
  
  puppets = [];
  
  
  setupStream = ({stream, identity})=> {
    console.log('setup stream in app',identity);
    this.puppets.push(<Puppet key={identity} stream={stream} identity={identity}/>);
    this.setState({identity});
  };
  
  
  setJoinURL = joinUrl=>
    this.setState({joinUrl});
  
  render() {
    const {joinUrl, hasSelf, hasOther} = this.state;
    
    return (
      <div className="App">
        {joinUrl}
        <hr/>
        {this.puppets}
      </div>
    );
  }
}

export default App;

