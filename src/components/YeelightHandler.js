import React, {useContext, useEffect, useState} from "react";
import "../App.css";
import {bulbContext} from "../App";

function YeelightHandler() {

  var lightOn = false;
  const [bulbProperties, setBulbProperties] = useState({
    ip: "",
    port: 0,
    color: [255, 255, 255],
    brightness: -0.1
  });

  const { bulbColor } = useContext(bulbContext);

  // Gather bulb properties from discovered bulb at startup
  // (asserting user only has one)
  useEffect(() => {
    fetch('/get_bulbs').then(res => res.json()).then(data => {
      setBulbProperties({
        ip: data.bulbs[0].ip,
        port: data.bulbs[0].port,
        color: [255, 255, 255],
        brightness: -0.1
      })
    });
    turnoff();
  }, []);

  // Update bulb color (data from ColorPicker)
  useEffect(() => {
    let r = parseInt(bulbColor.slice(1, 3), 16);
    let g = parseInt(bulbColor.slice(3, 5), 16);
    let b = parseInt(bulbColor.slice(5, 7), 16);

    bulbProperties.color = [r, g, b];
    setBulbProperties(bulbProperties);
  }, [bulbColor]);

  const { bulbBrightness } = useContext(bulbContext);

  var [counter, setCounter] = useState(0);
  useEffect(() => {
    if (counter === 5) {
      if (bulbBrightness >= 80) {
        console.log("boom");
      }
      if (Math.abs(bulbBrightness - bulbProperties.brightness) >= 10) {
        if (bulbBrightness >= 80) {
          bulbProperties.brightness = 100;
        } else {
          bulbProperties.brightness = 20;
        }
        // console.log(bulbBrightness);
        lightup();
        setBulbProperties(bulbProperties);
      }
      setCounter(0);
    }
    else {
      setCounter(counter + 1);
    }
  }, [bulbBrightness]);

  function toggleLight() {
    if (lightOn) {
      turnoff();
    }
    else {
      lightup();
    }
    lightOn = !lightOn;
  }

  // Make a POST request to Flask to light up the bulb
  function lightup() {
    fetch('/light_on', {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify(bulbProperties)
    })
  }

  function turnoff() {
    fetch('/light_off', {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
    })
  }

  return(
    <div className="YeelightHandler">
      <button onClick={toggleLight}>LET THERE BE LIGHT</button>
    </div>
  );
}

export default YeelightHandler;
