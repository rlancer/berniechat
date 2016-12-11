import Puppet from '../components/Puppet';
import Twil from './Twil';

export default class Logic {
  
  constructor(app) {
    this.characters = [
      {key: 'berine', path: 'Bernie.jpg', splitPoint: 236, width: 400, height: 400, name: 'Bernie'},
      {key: 'larryasbernie', path: 'LaryAsBerine.jpg', splitPoint: 133, width: 379, height: 400, name: 'Larry as Bernie'},
      {key: 'trump', path: 'Trump.jpg', splitPoint: 159, width: 379, height: 400, name: 'Trump'},
      {key: 'alecastrump', path: 'AlecAsTrump.jpg', splitPoint: 220, width: 379, height: 400, name: 'Alec as Trump'}
    ];
    this.app = app;
    this.identies = {};
    this.twil = new Twil({logic: this});
    
    window.onpopstate = (event) => {
      if (document.location.pathname === '/')
        app.setState({character: false});
    }
  }
  
  add = ({stream, identity, isSelf}) => {
    if (isSelf)
      this.selfIdentity = identity;
    
    const puppet = new Puppet({stream, identity, isSelf, volumeUpdate: this.volumeUpdate, logic: this});
    this.identies[identity] = puppet;
  };
  
  remove = ({identity}) => {
    this.identies[identity].cleanUp();
    delete this.identies[identity];
  };
  
  setSelfCharacter = char => {
    this.selfCharacter = char;
    this.app.setState({character: char.key});
    this.twil.pushRoomToPath();
  };
  
  changeMyCharacter = () => {
    this.app.setState({character: false});
  }
}