import firebase from './firebase';
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

export default {
  
  async start(view){
    
    const {identity, token} = await getIdent();
    
    const client = new twilio.Video.Client(token);
    
    const localMedia = new twilio.Video.LocalMedia();
    await localMedia.addMicrophone();
    
    const room = await client.connect({to: 'room-name', localMedia});
    console.log('Connected to Room "%s"', room.name);
    
    const l = participant=> {
      console.log('PARTIICPANT', participant);
      // console.log('participant.media.mediaStreams',  participant.media.tracks);
      
      participant.media.on('trackAdded', function trackAdded(track) {
        view.setupStream({stream: track.mediaStream, identity: participant.identity});
      });
      
      /* might need to use this? look into it if track added fails
       participant.media.tracks.forEach(track=> {
       
       });*/
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
  }
}