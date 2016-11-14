import React, {Component} from 'react';
import './App.css';
import system from './logic/system';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {joinUrl: false};
  }

  componentDidMount() {
    system.start(this);
  }

  setJoinURL = joinUrl=> {
    this.setState({joinUrl});
  };

  render() {
    const {joinUrl} = this.state;

    return (
      <div className="App">
        <h1>{joinUrl}</h1>
      </div>
    );
  }
}

export default App;
