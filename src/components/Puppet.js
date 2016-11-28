// make this into a class to facilitate mounting and unmouting
class Puppet {
  
  
  constructor({stream, identity, isSelf, volumeUpdate, index}) {
    
    this.vol = 0;
    
    if (!isSelf) {
      this.videoElement = document.createElement('VIDEO');
      /// videoElement.style =
      document.body.appendChild(this.videoElement);
      this.videoElement.src = window.URL.createObjectURL(stream);
      this.videoElement.play();
    }
    
    const sampleSize = 256;
    const audioContext = new window.AudioContext();
    const sourceNode = audioContext.createMediaStreamSource(stream);
    
    const analyserNode = audioContext.createAnalyser();
    const javascriptNode = audioContext.createScriptProcessor(sampleSize, 1, 1);
    // Create the array for the data values
    let amplitudeArray = new Uint8Array(analyserNode.frequencyBinCount);
    // setup the event handler that is triggered every time enough samples have been collected
    // trigger the audio analysis and draw one column in the display based on the results
    let ids = 0;
    
    javascriptNode.onaudioprocess = () => {
      amplitudeArray = new Uint8Array(analyserNode.frequencyBinCount);
      analyserNode.getByteTimeDomainData(amplitudeArray);
      
      let minValue = 9999999;
      let maxValue = 0;
      
      for (let i = 0; i < amplitudeArray.length; i++) {
        let value = amplitudeArray[i];
        
        if (value > maxValue)
          maxValue = value;
        else if (value < minValue)
          minValue = value;
      }
      
      this.vol = maxValue - minValue;
    };
    
    // Now connect the nodes together
    // Do not connect source node to destination - to avoid feedback
    sourceNode.connect(analyserNode);
    analyserNode.connect(javascriptNode);
    javascriptNode.connect(audioContext.destination);
  }
  
  cleanUp() {
    if (this.videoElement) {
      this.videoElement.pause();
      this.videoElement.src = '';
      document.body.removeChild(this.videoElement);
    }
  }
}

export default Puppet;
