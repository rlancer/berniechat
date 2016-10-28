import React, {Component} from 'react';
import Peer from 'simple-peer';

export default class PeerA extends Component {

  componentDidMount() {

    const p = new Peer({initiator: true, trickle: false});

    console.log(p);
    p.on('error', function (err) {
      console.log('error', err);
    });

    p.on('signal', function (data) {
      console.log('SIGNAL', JSON.stringify(data))
    });

    p.on('connect', function () {
      console.log('CONNECT');
      p.send('whatever' + Math.random());
    });

    p.on('data', function (data) {
      console.log('data: ' + data)
    });
  }

  render() {
    return <div>PEEREEEER</div>;
  }
}