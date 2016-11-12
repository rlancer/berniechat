import firebase from './firebase';
import shortid from 'shortid';
import Peer from 'simple-peer';

let userId = localStorage.getItem("user");

if (!userId) {
  userId = shortid.generate();
  localStorage.setItem("user", userId);
}

export default {
  get userId() {
    return userId;
  }
}