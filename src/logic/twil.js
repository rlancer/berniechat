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
    view.setIdentity(identity);
    
    const client = new twilio.Video.Client(token);
    
    const localMedia = new twilio.Video.LocalMedia();
    const mic = await localMedia.addMicrophone();
    
    const room = await client.connect({to: 'room-name', localMedia});
    // console.log('Media stream of local', room.localParticipant.media.mediaStreams);
    
    // room.localParticipant.on('trackAdded', (track)=>
    console.log(mic.mediaStream, localMedia);
    view.setupStream({stream: mic.mediaStream, identity: room.localParticipant.identity, isSelf: true});


//    view.setupStream({stream: room.localParticipant.media.mediaStream, identity: room.localParticipant.identity, isSelf: true});
    
    room.on('trackAdded', (track, participant)=>
      view.setupStream({stream: track.mediaStream, identity: participant.identity, isSelf: identity === participant.identity}));
    
    room.on('participantDisconnected', (participant) => {
      console.log(participant.identity + ' left the Room');
      view.removeStream({identity: participant.identity});
    });
    
    window.addEventListener('unload', ()=> room.disconnect());
  }
}