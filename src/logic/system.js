import firebase from './firebase';
import shortid from 'shortid';
import Peer from 'simple-peer';

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
  console.log('added', data.val(), data.key);
});

available.on('child_changed', data => {
  console.log('chid changed', data);
});

available.on('child_removed', data => {
  console.log('removed', data);
});

export default {
  get userId() {
    return userId;
  }
}