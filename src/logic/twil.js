import firebase from './firebase';
import request from 'superagent';
import shortId from 'shortid';

const getConfig = async() =>
  (await request.get('https://debateoff-back-dqyngdjfkw.now.sh/twilio')).body;

const getIdent = async() =>
  (await request.get('https://debateoff-back-derdepupkp.now.sh/vid')).body;

// eslint-disable-next-line
const twilio = Twilio;

const getUserMedia = () => new Promise((resolve, reject) =>
  navigator.getUserMedia({audio: true, video: false}, stream => resolve(stream), err => reject(err))
);

export default {
  
  async start(view){
    
    let roomId = false;
    const path = window.location.pathname.substring(1);
    
    if (path.startsWith('join/')) {
      roomId = path.split('/')[1];
      console.log('joining ', roomId);
      view.setJoinedRoom({room: roomId});
    }
    else {
      roomId = shortId.generate();
      console.log('generated room', roomId);
      view.setJoinURL({room: roomId});
    }
    
    
    
    const {identity, token} = await getIdent();
    
    view.setIdentity(identity);
    
    const client = new twilio.Video.Client(token);
    
    const localMedia = new twilio.Video.LocalMedia();
    
    const mic = await localMedia.addMicrophone();
    
    const room = await client.connect({to: roomId, localMedia});
    
    view.setupStream({stream: mic.mediaStream, identity: room.localParticipant.identity, isSelf: true});
    
    room.on('trackAdded', (track, participant) =>
      view.setupStream({stream: track.mediaStream, identity: participant.identity, isSelf: identity === participant.identity}));
    
    room.on('participantDisconnected', (participant) =>
      view.removeStream({identity: participant.identity}));
    
    window.addEventListener('unload', () => room.disconnect());
  }
}