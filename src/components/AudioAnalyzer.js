import React, {useEffect, useState, useRef} from "react";
import Sketch from "react-p5";
import "../App.css";

function AudioAnalyzer() {

  // WebAudio API's contexts, audio elements etc.
  // vars had to be used instead of consts
  const audioContext = new AudioContext();
  var audioAnalyser, audioGain;
  var dataArray;
  var [audioElement, setAudioElement] = useState(null);
  var [audioTrack, setAudioTrack] = useState(null);

  var musicPlaying = false;

  // values used to map and draw rectangles
  var outMin = 0;
  var outMax = 512;
  var inMin, inMax;

  // TODO provide ability to upload custom songs
  // Effect at render to set all the necessary WebAudio elements
  useEffect(() => {
    audioElement = document.querySelector('audio');
    audioTrack = audioContext.createMediaElementSource(audioElement);
    audioAnalyser = audioContext.createAnalyser();
    audioGain = audioContext.createGain();
    audioAnalyser.fftSize = 256;
    dataArray = new Uint8Array(audioAnalyser.frequencyBinCount);
    audioTrack.connect(audioGain).connect(audioContext.destination);
    audioGain.gain.value = 0.3;
    audioTrack.connect(audioAnalyser);
  }, [audioElement, audioTrack]);

  // Gather FFT audio data and redraw animation until music is playing
  // Bass is from 60 to 250 Hz and that's
  function drawFrequencyData() {
    audioAnalyser.getByteFrequencyData(dataArray);
    if (musicPlaying) {
      window.requestAnimationFrame(drawFrequencyData);
    }
  }

  // A function to play/pause music (audioElement) using a flag
  function playMusic() {
    if (!musicPlaying) {
      audioElement.play();
      window.requestAnimationFrame(drawFrequencyData);
    }
    else {
      audioElement.pause();
    }
    musicPlaying = !musicPlaying;
  }

  // p5.js methods
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(512, 512).parent(canvasParentRef);
  };

  var i;
  const draw = (p5) => {
    p5.background(255);
    p5.fill(p5.color(0));
    for (i = 0; i < dataArray.length; i++) {
      p5.rect((4 * i), 512, 4, -2 * dataArray[i]);
    }
  };

  return(
    <div className="AudioAnalyzer">
      <h2>HOLA COMPANEROS</h2>
      <audio src="static/tokyodrift.mp3"/>
      <button className="PlayButton" onClick={playMusic}>PLAY THE EUROBEAT</button>
      <br/><br/>
      <Sketch setup={setup} draw={draw}/>
    </div>
  );
}

export default AudioAnalyzer;
