import firebase from './firebase';
import shortid from 'shortid';
import Peer from 'simple-peer';

let userId = localStorage.getItem("user");

const updatePing = ()=>firebase.database().ref(`yooo/${userId}`).set({time: (new Date()).getTime()});
window.setInterval(updatePing, 15000);
updatePing();

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


// order by the date they joined
// make a request to the one cient above you and bellow you


// to avoid conflicts make a client a pitcher or a catcher

// pitchers send requests
// catchers receive requests


// have a date joined timestap for when there session starts

// get random client to debate with
// create a debate room record under that client with said signaling info


// client listens of debate rooms and connects if it has one

// when client connects to a room it sets the status form pending to  connecting
// it then takes all the other records under its room and it deletes them

// when client that sent out the debate notifications gets the signal that its connecting, it should delete


// notify client that it wants to debate

// listen for clients trying to debate
// if it gets a client its trying to debate with send an ak

// listen for ak and start up a debate


// client with greater ID will be akknowdleger


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

    peerSelf.on('error', function (err) {
      console.log('error', err);
    });

    peerSelf.on('connect', function () {
      console.log('CONNECT');
      peerSelf.send('whatever' + Math.random());
    });

    peerSelf.on('data', function (data) {
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