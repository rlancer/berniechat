import firebase from './firebase';
import request from 'superagent';
import shortId from 'shortid';

const getIdent = async(character) =>
  (await request.get(`https://debateoff-back-agqllyxisq.now.sh/vid?character=${character}`)).body;

// eslint-disable-next-line
const twilio = Twilio;

const getUserMedia = () => new Promise((resolve, reject) =>
  navigator.getUserMedia({audio: true, video: false}, stream => resolve(stream), err => reject(err))
);

let started = false;

export default class Twil {
  
  constructor({logic}) {
    this.logic = logic;
  }
  
  async init(character) {
    console.log('init with char', character);
    const {identity, token} = await getIdent(character);
    console.log('identity', identity);
    this.logic.app.setIdentity(identity);
    this.identity = identity;
    this.client = new twilio.Video.Client(token);
    this.localMedia = new twilio.Video.LocalMedia();
    this.mic = await this.localMedia.addMicrophone();
    
    await this.start();
  }
  
  async start() {
    
    this.roomId = false;
    const path = window.location.pathname.substring(1);
    
    const parts = path.split('/');
    this.roomId = parts[0].trim();
    
    if (this.roomId.length > 0 && this.roomId !== 'undefined')
      this.logic.app.setJoinedRoom({room: this.roomId});
    else {
      this.roomId = shortId.generate();
      this.logic.app.setJoinURL({room: this.roomId});
      this.pushRoomToPath();
    }
    
    const room = await this.client.connect({to: this.roomId, localMedia: this.localMedia});
    this.logic.add({stream: this.mic.mediaStream, identity: room.localParticipant.identity, isSelf: true});
    
    room.on('trackAdded', (track, participant) =>
      this.logic.add({stream: track.mediaStream, identity: participant.identity, isSelf: this.identity === participant.identity}));
    
    room.on('participantDisconnected', (participant) =>
      this.logic.remove({identity: participant.identity}));
    
    window.addEventListener('unload', () => room.disconnect());
  }
  
  pushRoomToPath() {
    //   history.pushState({room: this.roomId}, "Chatting!", `/${this.roomId}`);
  }
}