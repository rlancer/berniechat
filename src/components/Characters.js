import React from 'react';
import Component from './Component'


export default class Characters extends Component {
  
  constructor() {
    super();
    this.characters = [{key: 'larryasbernie', path: 'LarryAsBernie.png', splitPoint: 10}];
  }
  
  componentDidMount() {
    this.logic.characters = this;
  }
  
  render() {
    return <div style={{border: 'solid 1px #eee'}}>
      {this.characters.map(char => <img src={`/characters/${char.path}`} key={char.key} ref={c => char.ref = c}/>)}
    </div>
  }
}