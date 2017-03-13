import Puppet from '../components/Puppet';
import Twil from './Twil';

export default class Logic {

  constructor(app) {
    this.characters = [
      {key: 'berine', path: 'Bernie.jpg', splitPoint: 236, width: 400, height: 400, name: 'Bernie'},
      {
        key: 'larryasbernie',
        path: 'LaryAsBerine.jpg',
        splitPoint: 133,
        width: 379,
        height: 400,
        name: 'Larry as Bernie'
      },
      {key: 'trump', path: 'Trump.jpg', splitPoint: 159, width: 379, height: 400, name: 'Trump'},
      {key: 'alecastrump', path: 'AlecAsTrump.jpg', splitPoint: 220, width: 379, height: 400, name: 'Alec as Trump'},
      {key: 'putin', path: 'Putin.jpg', splitPoint: 164, width: 400, height: 344, name: 'Putin'},
      {key: 'obama', path: 'Obama.jpg', splitPoint: 151, width: 344, height: 400, name: 'Obama'}
    ];

    this.app = app;
    this.identies = {};
    this.twil = new Twil({logic: this});

    window.onpopstate = (event) => {
      if (document.location.pathname === '/')
        app.setState({character: false});
    }
  }

  get history(){
    return this.router.history;
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

  setSelfCharacter = (char, view) => {
    this.selfCharacter = char;
    this.twil.init(char.key, view);
    this.app.setState({character: char.key});
  };

  changeMyCharacter = () => {
    this.app.setState({character: false});
  }
}