import React from 'react';
import Component from './Component'


export default class Characters extends Component {
  
  selectCharacter = (char) =>
    this.logic.setSelfCharacter(char);
  
  render() {
    return <div className="characterSelector" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{border: 'solid 1px #eee', backgroundColor: '#fefefe'}}>
        {this.logic.characters.map(char => <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
          <img style={{width: 220, cursor: 'pointer'}} onClick={() => this.selectCharacter(char)} width={char.width} src={`/characters/${char.path}`} key={char.key}
               ref={c => char.ref = c}/>
          <div>{char.name}</div>
        </div>)}
      </div>
    </div>
  }
}