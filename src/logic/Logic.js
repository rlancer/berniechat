import Puppet from '../components/Puppet';

class Logic {
  constructor(app) {
    this.characters = [
      {key: 'larryasbernie', path: 'LarryAsBernie.png', splitPoint: 10, width: 200},
      {key: 'berine', path: 'Bernie.jpg', splitPoint: 20, width: 200}
    ];
    this.app = app;
    this.identies = {};
    this.ownPuppet = false;
  }
  
  add = ({stream, identity, isSelf}) => {
    const puppet = new Puppet({stream, identity, isSelf, volumeUpdate: this.volumeUpdate});
    
    if (isSelf)
      this.ownPuppet = puppet;
    
    this.identies[identity] = new Puppet({stream, identity, isSelf, volumeUpdate: this.volumeUpdate});
  };
  
  remove = ({identity}) => {
    this.identies[identity].cleanUp();
    delete this.identies[identity];
  };
  
  setCharacter = char => {
    
  };
  
  
}

export default Logic;