import firebase from './firebase';
import SimplePeer from 'simple-peer';
import request from 'superagent';

const getConfig = async()=>
  (await request.get('https://debateoff-back-dqyngdjfkw.now.sh/twilio')).body;

const getIdent = async()=>
  (await request.get('https://debateoff-back-derdepupkp.now.sh/vid')).body;

// eslint-disable-next-line
const twilio = Twilio;

const getUserMedia = ()=>new Promise((resolve, reject)=>
  navigator.getUserMedia({audio: true, video: false}, stream=>resolve(stream), err=>reject(err))
);

const set = new Set();
set.add('a');
set.add('b');
set.add('c');
console.log(set);
console.log(set.values());

export default {
  
  async start(view){
    
    const {identity, token} = await getIdent();
    
    const client = new twilio.Video.Client(token);
    
    client.connect({to: 'room-name'}).then(room => {
      console.log('Connected to Room "%s"', room.name);
      
      const l = participant=> {
        console.log('PARTIICPANT');
        // console.log('participant.media.mediaStreams',  participant.media.tracks);
  
        participant.media.on('trackAdded', function trackAdded(track) {
          console.log('Track added', track.mediaStream, participant);
          view.setupStream(track.mediaStream);
        });
        
        participant.media.tracks.forEach(track=> {
          console.log({track});
        });
        // console.log('participant.media.mediaStreams.values()', JSON.stringify(participant.media.mediaStreams.values()));
        /*console.log('participant.media.mediaStreams.entries()', participant.media.mediaStreams.entries());
         console.log('participant.media.mediaStreams', participant.media.mediaStreams);
         console.log('participant.media.mediaStreams.entries().next().value', participant.media.mediaStreams.entries().next().value);*/
      };
      
      room.participants.forEach(participant => {
        // console.log('Participant "%s" is connected', participant.identity, participant, participant.media.audioTracks);
        // view.setupStream(participant.media);
        //   participant.media.attach(document.body);
        l(participant);
        // debugger;
      });
      
      room.on('participantConnected', participant => {
        // console.log('Participant "%s" connected', participant.identity);
        // participant.media.attach(document.body);
        
        l(participant);
        // participant.media.attach(document.body);
      });
      
      room.on('participantDisconnected', participant => {
        console.log('Participant "%s" disconnected', participant.identity);
      });
    });
  }
}