import firebase from './firebase';
import shortid from 'shortid';
import Peer from 'simple-peer';

let userId = localStorage.getItem("user");

const updatePing = ()=>firebase.database().ref(`yooo/${userId}`).set({time: (new Date()).getTime()});
window.setInterval(updatePing, 30000);


if (!userId) {
  userId = shortid.generate();
  localStorage.setItem("user", userId);
}

let peerSelf = false;
let peerSelfSignal = false;

const getMingler = async()=> {
  const values = Object.values((await firebase.database().ref('available').once('value')).val()).filter(val=>val.userId !== userId);
  return values[Math.floor(Math.random() * values.length)];
};

const hookMeUpRef = firebase.database().ref(`hookmeup/${userId}`);

hookMeUpRef.on('child_added', (data) => {
  console.log('HOOK ME UP!!!!!', data.key, data.val());


  // see if it should be initi or not
  /*const myPeer = new Peer({initiator: true, trickle: false, stream});

   myPeer.on('signal', (data)=> {
   firebase.database().ref(`mystream/${userId}`).set(data);
   });*/
});

let stream = false;

export default {
  get userId() {
    return userId;
  },

  set stream(strm) {
    stream = strm;
    peerSelf = new Peer({initiator: true, trickle: false, stream});
    peerSelf.on('signal', function (data) {

      console.log('SIGNAL DATA', JSON.stringify(data));

      peerSelfSignal = data;
      const toSet = {signal: data, userId};
      firebase.database().ref(`users/${userId}`).set(toSet);
      firebase.database().ref(`available/${userId}`).set(toSet);
    });

    peerSelf.on('error', (err)=> {
      console.log('error', err);
    });

    peerSelf.on('connect', () => {
      console.log('CONNECT');
      peerSelf.send('whatever' + Math.random());
    });

    peerSelf.on('data', (data)=> {
      console.log('data: ' + data)
    });

    console.log('STREARMRMRMR', strm, stream);
  },

  async connectToClient(clientSignal){
    console.log('clientSignal', clientSignal);

    const client = await getMingler();

    peerSelf.signal(JSON.parse(clientSignal));

    peerSelf.on('connect', () => {
      console.log('peer self connected!');
      // wait for 'connect' event before using the data channel
      peerSelf.send('hey peer2, how is it going?');
    });
  }
}