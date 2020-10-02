import React, {useContext, useEffect, useState} from "react";
import "../App.css";
import {bulbContext} from "../App";

function YeelightHandler() {

  const [bulbProperties, setBulbProperties] = useState({});

  const { bulbColor } = useContext(bulbContext);

  // Gather bulb properties from discovered bulb at startup
  // (asserting user only has one)
  useEffect(() => {
    fetch('/get_bulbs').then(res => res.json()).then(data => {
      setBulbProperties({
        ip: data.bulbs[0].ip,
        port: data.bulbs[0].port,
      })
    });
  }, []);


  // Update bulb color (data from ColorPicker)
  useEffect(() => {
    let r = parseInt(bulbColor.slice(1, 3), 16);
    let g = parseInt(bulbColor.slice(3, 5), 16);
    let b = parseInt(bulbColor.slice(5, 7), 16);

    bulbProperties["color"] = [r, g, b];
    setBulbProperties(bulbProperties);
  }, [bulbColor]);

  // Make a POST request to Flask to light up the bulb
  function lightup() {
    fetch('/light_up', {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify(bulbProperties)
    })
  }

  return(
    <div className="YeelightHandler">
      <button onClick={lightup}>LET THERE BE LIGHT</button>
    </div>
  );
}

export default YeelightHandler;
