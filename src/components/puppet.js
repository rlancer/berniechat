function puppet({stream, identity, isSelf, volumeUpdate}) {
  
  if (!isSelf) {
    const videoElement = document.createElement('VIDEO');
    /// videoElement.style =
    document.body.appendChild(videoElement);
    videoElement.src = window.URL.createObjectURL(stream);
    videoElement.play();
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
    
    volumeUpdate(maxValue - minValue);
  };
  
  // Now connect the nodes together
  // Do not connect source node to destination - to avoid feedback
  sourceNode.connect(analyserNode);
  analyserNode.connect(javascriptNode);
  javascriptNode.connect(audioContext.destination);
}


export default puppet;
