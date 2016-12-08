import Puppet from '../components/Puppet';
import system from './twil';

export default class Logic {
  
  constructor(app) {
    this.characters = [
      {key: 'berine', path: 'Bernie.jpg', splitPoint: 236, width: 400, height: 400, name: 'Bernie'},
      {key: 'larryasbernie', path: 'LaryAsBerine.jpg', splitPoint: 133, width: 379, height: 400, name: 'Larry as Bernie'}
    ];
    this.app = app;
    this.identies = {};
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