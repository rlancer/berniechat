import React from 'react';
import Component from '../components/Component';
import copy from 'copy-to-clipboard';
import Snackbar from 'material-ui/Snackbar';

export default class Path extends Component {
  
  constructor(props) {
    super(props);
    this.state = {showedCopied: false};
  }
  
  copyUrl = () => {
    copy(this.url);
    this.setState({showedCopied: true});
  };
  
  get url() {
    const {joined, room} = this.props;
    return `${this.isLocal ? 'http://localhost:3000' : 'https://bernie.chat'}/${room}`;
  }
  
  closeShowCopied = () =>
    this.setState({showedCopied: false});
  
  render() {
    const
      {joined, room} = this.props,
      {showedCopied} = this.state;
    
    return <div style={{backgroundColor: '#fff', padding: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      {room ?
        <div onClick={this.copyUrl} style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
          <h1 style={{cursor: 'pointer'}}>Invite friends to chat as Bernie!</h1>
          <h2 style={{cursor: 'pointer'}}>{this.url}</h2>
        </div> :
        <h1>Connected to {joined} &middot; <a href="/">new session</a></h1>}
      <Snackbar autoHideDuration={2500} message='Copied to clipboard' open={showedCopied} onRequestClose={this.closeShowCopied}/>
    </div>;
    
  }
}

