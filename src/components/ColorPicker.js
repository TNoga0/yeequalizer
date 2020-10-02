import React, {useState} from "react";
import { ChromePicker } from "react-color";
import "../App.css";

function ColorPicker(props) {

  const [bgColor, setBgColor] = useState("#ffffff");

  const handleColorChangeCompleted = (color) => {
    props.changeBgColor(color.hex);
    setBgColor(color.hex);
  };

  return (
    <div className="ColorPicker">
      <h1>Elo.</h1>
      <ChromePicker
        color={bgColor}
        onChangeComplete={handleColorChangeCompleted}
      />
    </div>
  );
}

export default ColorPicker;
