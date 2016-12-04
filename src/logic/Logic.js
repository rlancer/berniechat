import Puppet from '../components/Puppet';

class Logic {
  constructor(app) {
    this.characters = [
      {key: 'berine', path: 'Bernie.jpg', splitPoint: 20, width: 200},
      {key: 'larryasbernie', path: 'LarryAsBernie.png', splitPoint: 10, width: 200}
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
  
  setSelfCharacter = char => this.selfCharacter = char;
  
}

export default Logic;