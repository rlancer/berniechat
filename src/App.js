import React, {Component} from 'react';
import AppMain from './AppMain';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import Characters from './views/Characters';
import Logic from './logic/Logic';
import Canvas from './views/Canvas';

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
    this.logic.router = this._router;
  }

  routerRef = c => this._router = c;

  render() {

    return <Router ref={this.routerRef}>
      <div>
        <Route path="/" exact={true} component={Characters}/>
        <Route path="/:room" render={() => <div>CANVAS</div>}/>


        <div style={{flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '2rem 0'}}>
          Join our&nbsp;<a href="https://www.collaborizm.com/project/H1DQb64zg" target="_blank">Project</a>&nbsp;
          on&nbsp;<a href="https://www.collaborizm.com" target="_blank">Collaborizm</a>
          &nbsp;|&nbsp;&copy; Trumpaphone.com {new Date().getFullYear()}
        </div>

        <iframe
          src="https://www.facebook.com/plugins/like.php?href=https%3A%2F%2Fwww.facebook.com%2Ftrumpaphone%2F&width=106&layout=button_count&action=like&size=small&show_faces=true&share=true&height=46"
          width="106" height="23"
          style={{zIndex: 10, position: 'fixed', top: 10, right: 10, border: 'none', overflow: 'hidden'}} scrolling="no"
          frameBorder="0" allowTransparency="true"/>

      </div>
    </Router>;

  }
}

export default App;
