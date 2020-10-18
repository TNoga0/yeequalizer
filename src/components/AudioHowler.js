import React, {useEffect, useState, useRef} from "react";
import Sketch from "react-p5";
import ReactHowler from 'react-howler';
import {Howl, Howler} from 'howler';
import "../App.css";

function AudioHowler(props) {

  const [player, setPlayer] = useState(null);
  const [playMusic, setPlayMusic] = useState(false);
  const [analyser, setAnalyser] = useState(null);
  const [dataArray, setDataArray] = useState([]);
  const [bgColor, setBgColor] = useState([255, 255, 255]);

  // This variable is needed because playMusic's update seems to be ignored
  // by drawFrequencyData
  var stopMusic = false;

  var fftSize = 512;
  var canvasSize = 512;

  // p5.js methods
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(canvasSize, canvasSize).parent(canvasParentRef);
  };

  var i;
  const draw = (p5) => {
    if (playMusic) {
      p5.background(p5.color(bgColor[0], bgColor[1], bgColor[2]));
      p5.fill(p5.color(0));
      for (i = 0; i < dataArray.length; i++) {
        p5.rect(((canvasSize/fftSize) * 2 * i), 512, canvasSize/fftSize * 2, -1.5 * dataArray[i]);
      }
    }
  };
  // end p5.js methods

  // after selected background color changes, update the bgColor state
  useEffect(() => {
    let r = parseInt(props.bgColor.slice(1, 3), 16);
    let g = parseInt(props.bgColor.slice(3, 5), 16);
    let b = parseInt(props.bgColor.slice(5, 7), 16);
    setBgColor([r, g, b]);
  }, [props.bgColor]);

  useEffect(() => {
    console.log(playMusic);
    if (playMusic) {
      window.requestAnimationFrame(drawFrequencyData);
    }
  }, [playMusic]);

  useEffect(() => {
    if (player !== null && analyser === null) {
      setAnalyser(Howler.ctx.createAnalyser());
      console.log(player);
      console.log(Howler.ctx);
    }
    if (analyser !== null) {
      analyser.fftSize = fftSize;
      Howler.masterGain.connect(analyser);
      analyser.connect(Howler.ctx.destination);
      setDataArray(new Uint8Array(analyser.frequencyBinCount));
    }
  }, [player, analyser]);

  // Gather FFT audio data and redraw animation until music is playing
  // Bass is from 60 to 250 Hz and that's the range I need for yeelight
  // flickering
  // f = N * sample_rate/fftSize
  // where f is frequency band, N is the dataArray element
  function drawFrequencyData() {
    analyser.getByteFrequencyData(dataArray);
    if (playMusic && !stopMusic) {
      window.requestAnimationFrame(drawFrequencyData);
    }
  }

  return(
    <div className="AudioHowler">
      <h2>HOLA COMPANEROS</h2>
      <ReactHowler
        src="static/tokyodrift.mp3"
        playing={playMusic}
        volume={0.4}
        ref={(ref) => (setPlayer(ref))}
      />
      <button className="PlayButton" onClick={() => {
        setPlayMusic(!playMusic);
        stopMusic = !stopMusic;
      }
      }>PLAY THE EUROBEAT</button>
      <br/><br/>

      <Sketch setup={setup} draw={draw}/>
    </div>
  );
}

export default AudioHowler;
