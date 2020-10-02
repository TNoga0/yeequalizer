import React, {createContext, useEffect, useState} from 'react';
import './App.css';
import ColorPicker from "./components/ColorPicker";
import YeelightHandler from "./components/YeelightHandler";

// Context for passing bulb data between siblings
export const bulbContext = createContext({});

function App() {

  // State passed from ColorPicker to YeelightHandler
  const [bulbColor, setBulbColor] = useState("#ffffff");

  const { Provider } = bulbContext;

  useEffect(() => {
    document.body.style.backgroundColor = bulbColor;
  }, [bulbColor]);

  return (
    <Provider value={{ bulbColor }}>
      <div className="App">
        <ColorPicker changeBgColor={setBulbColor}/>
        <br/>
        <YeelightHandler/>
      </div>
    </Provider>
  );
}

export default App;
