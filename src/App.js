import axios from 'axios';
import {key} from './Key.js';
import React, { useEffect, useState } from "react";
import {calculateScore} from './calculateScore.js';
import {unixToTime} from './unix.js'

function App() {
  // inputs
  const myKey = key;
  const lat = '42.53';
  const long = '-71.35';
  const lang = 'en';
  const units = 'metric'
  const cnt = 10;
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${myKey}&lang=${lang}&units=${units}&cnt=${cnt}`


  const [score, setScore] = useState(0);
  const [location, setLoc] = useState('Earth');
  const [time, setTime] = useState('7:43pm');



  useEffect(() => {
    axios
      .get(url)
      .then(res => {
        setScore(Math.round(calculateScore(res.data)));
        setLoc(res.data['city']['name']);
        setTime(unixToTime(res.data['city']['sunset']));
      })
      .catch(err => {console.log('error')})
  });




  return (
    <body className="text-gray-900 font-sans">
            <div style={{backgroundImage: `url('https://cdn.pixabay.com/photo/2012/08/27/14/19/mountains-55067_1280.png')`,  backgroundRepeat: 'no-repeat'}} className="h-screen min-w-full bg-cover flex flex-col justify-between">
                <div id="nav-bar" className="m-4">
                    <nav className="flex justify-between">
                        <div className="flex align-middle">
                            <h3 className="font-bold text-4xl text-white">Sunset</h3>
                        </div>
                        <div className="flex align-middle">

                        </div>
                    </nav>
                </div>
                 <div id="hero" className="flex justify-center -mt-24 text-white">
                     <div id="text" className="text-left">
                         <h2 className="text-md">How's the sunset today?</h2>
                         <h1 className="text-9xl">{score}/10</h1>
                     </div>
                 </div>
                 <div id="bottom">
                     <h2 className="text-gray-50 text-sm p-1">The sun sets at {time} in {location}</h2>
                 </div>
             </div>
     </body>
  );
}

export default App;
