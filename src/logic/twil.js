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
  
  async start(logic){
    
    let roomId = false;
    const path = window.location.pathname.substring(1);
    
    const parts = path.split('/');
    roomId = parts[0].trim();
    
    if (roomId.length > 0)
      logic.app.setJoinedRoom({room: roomId});
    else {
      roomId = shortId.generate();
      logic.app.setJoinURL({room: roomId});
      history.pushState({room: roomId}, "Chatting!", `/${roomId}`);
    }
    
    const {identity, token} = await getIdent();
    logic.app.setIdentity(identity);
    
    const client = new twilio.Video.Client(token);
    const localMedia = new twilio.Video.LocalMedia();
    const mic = await localMedia.addMicrophone();
    const room = await client.connect({to: roomId, localMedia});
    
    logic.add({stream: mic.mediaStream, identity: room.localParticipant.identity, isSelf: true});
    
    room.on('trackAdded', (track, participant) =>
      logic.add({stream: track.mediaStream, identity: participant.identity, isSelf: identity === participant.identity}));
    
    room.on('participantDisconnected', (participant) =>
      logic.remove({identity: participant.identity}));
    
    window.addEventListener('unload', () => room.disconnect());
  }
}