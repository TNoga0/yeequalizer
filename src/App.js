import React, {createContext, useEffect, useState} from 'react';
import './App.css';
import ColorPicker from "./components/ColorPicker";
import YeelightHandler from "./components/YeelightHandler";
import AudioHowler from "./components/AudioHowler";

// Context for passing bulb data between siblings
export const bulbContext = createContext({});

function App() {

  // State passed from ColorPicker to YeelightHandler
  const [bulbColor, setBulbColor] = useState("#ffffff");
  const [bulbBrightness, setBulbBrightness] = useState(0);

  const { Provider } = bulbContext;

  useEffect(() => {
    document.body.style.backgroundColor = bulbColor;
  }, [bulbColor]);

  return (
    <Provider value={{ bulbColor, bulbBrightness, setBulbBrightness }}>
      <div className="App">
        <ColorPicker changeBgColor={setBulbColor}/>
        <br/>
        <YeelightHandler />
        <br/>
        <AudioHowler bgColor={bulbColor}/>
      </div>
    </Provider>
  );
}

export default App;
