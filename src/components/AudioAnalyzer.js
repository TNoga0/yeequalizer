import React, {useEffect, useState, useRef} from "react";
import "../App.css";

function AudioAnalyzer() {

  // WebAudio API's contexts, audio elements etc.
  // vars had to be used instead of consts
  const audioContext = new AudioContext();
  var audioAnalyser;
  var dataArray;
  var [audioElement, setAudioElement] = useState(null);
  var [audioTrack, setAudioTrack] = useState(null);

  var musicPlaying = false;

  // TODO provide ability to upload custom songs
  // Effect at render to set all the necessary WebAudio elements
  useEffect(() => {
    audioElement = document.querySelector('audio');
    audioTrack = audioContext.createMediaElementSource(audioElement);
    audioAnalyser = audioContext.createAnalyser();
    audioAnalyser.fftSize = 256;
    dataArray = new Float32Array(audioAnalyser.frequencyBinCount);
    audioTrack.connect(audioContext.destination);
    audioTrack.connect(audioAnalyser);
  }, [audioElement, audioTrack]);

  // Gather FFT audio data and redraw animation until music is playing
  function draw() {
    audioAnalyser.getFloatFrequencyData(dataArray);
    if (musicPlaying) {
      window.requestAnimationFrame(draw);
    }
  }

  // A function to play/pause music (audioElement) using a flag
  function playMusic() {
    if (!musicPlaying) {
      audioElement.play();
      window.requestAnimationFrame(draw);
    }
    else {
      audioElement.pause();
    }
    musicPlaying = !musicPlaying;
  }

  return(
    <div className="AudioAnalyzer">
      <h2>HOLA COMPANEROS</h2>
      <audio src="static/tokyodrift.mp3"/>
      <button className="PlayButton" onClick={playMusic}>PLAY THE EUROBEAT</button>
    </div>
  );
}

export default AudioAnalyzer;
