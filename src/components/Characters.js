import React from 'react';
import Component from './Component'


export default class Characters extends Component {
  
  constructor() {
    super();
    this.characters = [
      {key: 'larryasbernie', path: 'LarryAsBernie.png', splitPoint: 10, width: 200},
      {key: 'berine', path: 'Bernie.jpg', splitPoint: 20, width: 200}
    ];
  }
  
  componentDidMount() {
    this.logic.characters = this;
  }
  
  selectCharacter =(char)=>{
    console.log('char',char);
    this.logic.selectCharacter = char;
    this.logic.app.setState({character:char.key});
  }
  
  render() {
    return <div style={{border: 'solid 1px #eee'}}>
      {this.characters.map(char => <img style={{cursor:'pointer'}} onClick={()=>this.selectCharacter(char)} width={char.width} src={`/characters/${char.path}`} key={char.key} ref={c => char.ref = c}/>)}
    </div>
  }
}