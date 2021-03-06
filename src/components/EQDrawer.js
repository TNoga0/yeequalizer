import React, {useEffect} from "react";
import Sketch from "react-p5";
import "../App.css";

function EQDrawer(props) {

  const canvasSize = props.fftSize;

  // p5.js methods
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(canvasSize, canvasSize).parent(canvasParentRef);
  };

  var i;
  const draw = (p5) => {
    let rectWidth = canvasSize/props.bandIndexes.length;
    if (props.drawFlag) {
      p5.background(p5.color(props.canvasColor[0], props.canvasColor[1], props.canvasColor[2]));
      p5.fill(p5.color(0));
      for (i = 0; i < props.bandIndexes.length; i++) {
        p5.rect((rectWidth * i), 512, rectWidth, -1.5 * props.audioData[props.bandIndexes[i]]);
      }
    }
  };
  // end p5.js methods

  return(
    <div className="EQDrawer">
      <Sketch setup={setup} draw={draw}/>
    </div>
  );
}

export default EQDrawer;