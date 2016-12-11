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
    const {roomId} = this.logic.twil;
    return `${this.isLocal ? 'http://localhost:3000' : 'https://bernie.chat'}/${roomId}`;
  }
  
  closeShowCopied = () =>
    this.setState({showedCopied: false});
  
  render() {
    const {showedCopied} = this.state;
    return <div style={{padding: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <div onClick={this.copyUrl} style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
        <h1 style={{cursor: 'pointer'}}>Invite friends &middot; {this.url} &middot; <a href="/">Leave room</a></h1>
      </div>
      <Snackbar autoHideDuration={2500} message='Copied to clipboard' open={showedCopied} onRequestClose={this.closeShowCopied}/>
    </div>;
    
  }
}

