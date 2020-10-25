import React, {useEffect, useState, useContext} from "react";
import Sketch from "react-p5";
import ReactHowler from 'react-howler';
import {Howl, Howler} from 'howler';
import "../App.css";
import EQDrawer from "./EQDrawer";
import {bulbContext} from "../App";

function AudioHowler(props) {

  const [player, setPlayer] = useState(null);
  const [playMusic, setPlayMusic] = useState(false);
  const [analyser, setAnalyser] = useState(null);
  const [dataArray, setDataArray] = useState([]);
  const [bgColor, setBgColor] = useState([255, 255, 255]);

  const [eqData, setEQData] = useState([]);

  const fftSize = 512;
  const sampleRate = 44100;

  // This variable is needed because playMusic's update seems to be ignored
  // by drawFrequencyData
  var stopMusic = false;

  // Get the index ranges for EQ frequencies
  const eqArrayIndexes = gatherFrequencyRanges(fftSize);

  // after selected background color changes, update the bgColor state
  useEffect(() => {
    let r = parseInt(props.bgColor.slice(1, 3), 16);
    let g = parseInt(props.bgColor.slice(3, 5), 16);
    let b = parseInt(props.bgColor.slice(5, 7), 16);
    setBgColor([r, g, b]);
  }, [props.bgColor]);

  useEffect(() => {
    if (playMusic) {
      window.requestAnimationFrame(drawFrequencyData);
    }
  }, [playMusic]);

  useEffect(() => {
    if (player !== null && analyser === null) {
      setAnalyser(Howler.ctx.createAnalyser());
    }
    if (analyser !== null) {
      analyser.fftSize = fftSize;
      Howler.masterGain.connect(analyser);
      analyser.connect(Howler.ctx.destination);
      setDataArray(new Uint8Array(analyser.frequencyBinCount));
    }
  }, [player, analyser]);

  const { setBulbBrightness } = useContext(bulbContext);

  // Gather FFT audio data and redraw animation until music is playing
  // Bass is from 60 to 250 Hz and that's the range I need for yeelight
  // flickering
  // f = N * sample_rate/fftSize
  // where f is frequency band, N is the dataArray element
  function drawFrequencyData() {
    analyser.getByteFrequencyData(dataArray);
    setEQData(dataArray);
    setBulbBrightness(dataArray[eqArrayIndexes[1]] / 2.56);
    if (playMusic && !stopMusic) {
      window.requestAnimationFrame(drawFrequencyData);
    }
  }

  // Method to gather fixed frequency bands
  function gatherFrequencyRanges(fftSize) {
    // sub-bass - 30Hz
    let lowBassIndex = Math.round((30 * fftSize)/sampleRate);
    // low bass - 100Hz
    let bassIndex = Math.round((100 * fftSize)/sampleRate);
    // mid - 1kHz
    let midIndex = Math.round((1000 * fftSize)/sampleRate);
    // lower-upper mid - 5kHz
    let upperMidIndex = Math.round((5000 * fftSize)/sampleRate);
    // upper mid - 10kHz
    let trebleIndex = Math.round((10000 * fftSize)/sampleRate);
    return [
      lowBassIndex,
      bassIndex,
      midIndex,
      upperMidIndex,
      trebleIndex
    ]
  }


  return(
    <div className="AudioHowler">
      <h2>HOLA COMPANEROS</h2>
      <ReactHowler
        src="static/indaclub.mp3"
        playing={playMusic}
        volume={0.3}
        ref={(ref) => (setPlayer(ref))}
      />
      <button className="PlayButton" onClick={() => {
        setPlayMusic(!playMusic);
        stopMusic = !stopMusic;
      }
      }>PLAY THE EUROBEAT</button>
      <br/><br/>

      <EQDrawer
        audioData={eqData}
        bandIndexes={eqArrayIndexes}
        drawFlag={playMusic}
        canvasColor={bgColor}
        fftSize={fftSize}
      />
    </div>
  );
}

export default AudioHowler;
