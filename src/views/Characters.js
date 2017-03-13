import React from 'react';
import Component from '../components/Component'


export default class Characters extends Component {

  constructor(props) {
    super(props);
    console.log('props', props);
  }

  selectCharacter = (char) => {
    // console.log('SELECT SELECF CHAR',char, this.props.history.push('/dfgdfg'));
    this.logic.setSelfCharacter(char, this);
  };

  render() {
    return <div style={this.props.style}>
      <div style={{padding: '2rem', textAlign: 'center'}}>
        <h1>Pick your poison...</h1>
      </div>
      <div className="characterSelector" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>


        <div style={{
          borderRadius: 3,
          maxWidth: 560,
          padding: '1rem',
          backgroundColor: '#fefefe',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-around'
        }}>
          {this.logic.characters.map(char => <div key={char.key} onClick={() => this.selectCharacter(char)}
                                                  style={{
                                                    cursor: 'pointer',
                                                    margin: '1rem',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    flexDirection: 'column'
                                                  }}>
            <img style={{width: 220}} width={char.width} src={`/characters/${char.path}`} key={char.key}
                 ref={c => {
                   if (c != null)
                     char.ref = c;
                 }}/>
            <div>{char.name}</div>
          </div>)}
        </div>
      </div>
    </div>
  }
}