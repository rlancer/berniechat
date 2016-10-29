import firebase from './firebase';
import shortid from 'shortid';
import Peer from 'simple-peer';
const availableToMingle = new Map();

let userId = localStorage.getItem("user");

if (!userId) {
  userId = shortid.generate();
  localStorage.setItem("user", userId);
}

const peer = new Peer({initiator: true, trickle: false});

peer.on('signal', function (data) {
  const toSet = {signal: data, userId};
  firebase.database().ref(`users/${userId}`).set(toSet);
  firebase.database().ref(`available/${userId}`).set(toSet);
});

peer.on('error', function (err) {
  console.log('error', err);
});

peer.on('connect', function () {
  console.log('CONNECT');
  peer.send('whatever' + Math.random());
});

peer.on('data', function (data) {
  console.log('data: ' + data)
});

const available = firebase.database().ref('available');

available.on('child_added', data => {
  console.log('child added', data, data.key !== userId);
  if (data.key !== userId)
    availableToMingle.set(data.key, data.val());
});

available.on('child_changed', data => {
  if (data.key !== userId)
    availableToMingle.set(data.key, data.val());
});

available.on('child_removed', data => {
  console.log('child removed', data, data.key !== userId);
  if (data.key !== userId)
    availableToMingle.delete(data.key);
});

export default {
  get userId() {
    return userId;
  },
  async getMingler () {

    const ttt = await firebase.database().ref('available').once('value');
    console.log(ttt, ttt.key, ttt.val());

    console.log('minglers', availableToMingle.size);
    const r = availableToMingle.values().next().value;
    console.log(r);
    return r;
  }
}