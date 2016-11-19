import firebase from './firebase';
import SimplePeer from 'simple-peer';
import request from 'superagent';

const getConfig = async()=>
  (await request.get('https://debateoff-back-dqyngdjfkw.now.sh/twilio')).body;

const getIdent = async()=>
  (await request.get('https://debateoff-back-derdepupkp.now.sh/vid')).body;


export default {
  
  
  async start(view){
    
    const {identity, token} = await getIdent();
    
    // eslint-disable-next-line
    const client = new Twilio.Video.Client(token);
    
    client.connect({to: 'room-name'}).then(room => {
      console.log('Connected to Room "%s"', room.name);
      
      room.participants.forEach(participant => {
        console.log('Participant "%s" is connected', participant.identity,participant);
        // view.setupStream(participant.media);
        participant.media.attach(document.body);
      });
      
      room.on('participantConnected', participant => {
        console.log('Participant "%s" connected', participant.identity);
        // participant.media.attach(document.body);
      });
      
      room.on('participantDisconnected', participant => {
        console.log('Participant "%s" disconnected', participant.identity);
      });
    });
    
  }
}