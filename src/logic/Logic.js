import Puppet from '../components/Puppet';
import system from './twil';

export default class Logic {
  
  constructor(app) {
    this.characters = [
      {key: 'berine', path: 'Bernie.jpg', splitPoint: 236, width: 400, height: 400, name: 'Bernie'},
      {key: 'larryasbernie', path: 'LaryAsBerine.jpg', splitPoint: 133, width: 379, height: 400, name: 'Larry as Bernie'},
      {key: 'trump', path: 'Trump.jpg', splitPoint: 133, width: 379, height: 400, name: 'Trump'},
      {key: 'alecastrump', path: 'AlecAsTrump.jpg', splitPoint: 133, width: 379, height: 400, name: 'Alec as Trump'}
    ];
    this.app = app;
    this.identies = {};
    
    window.onpopstate = (event) => {
      if (document.location.pathname === '/') {
        app.setState({character: false});
      }
    }
  }
  
  add = ({stream, identity, isSelf}) => {
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
    system.start(this);
    
    
  };
}