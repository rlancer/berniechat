import React from 'react';
import Component from './Component'


export default class Characters extends Component {
  
  selectCharacter = (char) =>
    this.logic.setSelfCharacter(char);
  
  render() {
    return <div>
      <div style={{padding: '2rem', textAlign: 'center'}}>
        <h1>Pick your poison...</h1>
      </div>
      <div className="characterSelector" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        
        
        <div style={{borderRadius: 3, maxWidth: 560, padding: '1rem', backgroundColor: '#fefefe', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around'}}>
          {this.logic.characters.map(char => <div onClick={() => this.selectCharacter(char)}
                                                  style={{cursor: 'pointer', margin: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
            <img style={{width: 220}} width={char.width} src={`/characters/${char.path}`} key={char.key}
                 ref={c => char.ref = c}/>
            <div>{char.name}</div>
          </div>)}
        </div>
      </div>
    </div>
  }
}