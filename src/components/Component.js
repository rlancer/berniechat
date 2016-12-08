import React from 'react';

export default class Component extends React.Component {
  
  static contextTypes = {
    logic: React.PropTypes.object.isRequired
  };
  
  get logic() {
    return this.context.logic;
  }
  
  get isLocal() {
    return window.location.pathname !== 'localhost';
  }
  
}


