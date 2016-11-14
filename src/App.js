import React, {Component} from 'react';
import './App.css';
import system from './logic/system';
import Puppet from './components/Puppet';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {joinUrl: false, hasSelf: false, hasOther: false};
  }

  componentDidMount() {
    system.start(this);
  }

  puppets = [];

  setupStream = (stream, isSelf)=> {
    this.puppets.push(<Puppet key={isSelf ? 'self' : 'other'} stream={stream} isSelf={isSelf}/>);
    this.setState({[isSelf ? 'hasSelf' : 'hasOther']: true});
  };

  setJoinURL = joinUrl=>
    this.setState({joinUrl});

  render() {
    const {joinUrl, hasSelf,hasOther} = this.state;

    return (
      <div className="App">
        <h1>{joinUrl}</h1>
        <hr/>
        {this.puppets}
      </div>
    );
  }
}

export default App;
