import React, {Component} from 'react';
import copy from 'copy-to-clipboard';
import Snackbar from 'material-ui/Snackbar';

class Path extends Component {
  
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
    return `https://bernie.chat/${room}`;
  }
  
  closeShowCopied = () => {
    this.setState({showedCopied: false});
  };
  
  render() {
    const
      {joined, room} = this.props,
      {showedCopied} = this.state;
    
    return <div style={{backgroundColor: '#fff', padding: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      {room ?
        <h1 onClick={this.copyUrl}>Invite friends {this.url}</h1> :
        <h1>Connected to {joined} &middot; <a href="/">new session</a></h1>}
      <Snackbar message='Copied to clipboard' open={showedCopied} onRequestClose={this.closeShowCopied}/>
    </div>;
    
  }
}

export default Path;

