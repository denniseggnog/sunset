import axios from 'axios';
import {key} from './Key.js';
import React, { useEffect, useState } from "react";
import {calculateScore} from './calculateScore.js';
import {unixToTime} from './unix.js'
import Modal from './Modal.js';

function App() {
  // inputs
  const myKey = key;
  // const [lati, setLati] = useState('');
  // const [long, setLong] = useState('');
  let lati = '';
  let long = '';
  const lang = 'en';
  const units = 'metric'
  const cnt = 10;
  let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lati}&lon=${long}&appid=${myKey}&lang=${lang}&units=${units}&cnt=${cnt}`
  // geocoding inputs
  // const [city, setCity] = useState('');
  // const [stateCode, setStateCode] = useState('');
  // const [countryCode, setCountryCode] = useState('');
  let city = '';
  let stateCode = '';
  let countryCode = '';

  const [score, setScore] = useState("N/A");
  const [location, setLoc] = useState('N/A');
  const [time, setTime] = useState('N/A');
  const [isLoading, setIsLoading] = useState(false);

  const [input, setInput] = useState('');
  let geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${stateCode},${countryCode}&limit=5&appid=${myKey}`

  const handleClick = (latitude, longitude) => {
    setIsLoading(true);
    lati = latitude;
    long = longitude;
    url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lati}&lon=${long}&appid=${myKey}&lang=${lang}&units=${units}&cnt=${cnt}`;
    console.log(url);
    axios
      .get(url)
      .then(res => {
        setScore(Math.round(calculateScore(res.data)) + "/10");
        setLoc(res.data['city']['name']);
        setTime(unixToTime(res.data['city']['sunset']));
        setIsLoading(false);
      })
      .catch(err => {alert('error')})


  }

    function handleString(string) {
        city = '';
        countryCode = '';
        stateCode = '';
        // setCountryCode('');
        // setStateCode('');

        const arr = string.split(',');

        if (arr.length === 0) {
            alert("Please input location in the format: city, full state name, country code (with the commas)")
        }
        else if (arr.length === 1) {
            city = arr[0];
        }
        else if (arr.length === 2) {
            city = arr[0];
            countryCode = arr[1];
        }
        else if (arr.length === 3){
            city = arr[0];
            stateCode = arr[1]
            countryCode = arr[2];
        }
        geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${stateCode},${countryCode}&limit=5&appid=${myKey}`;
    }

    function handleSubmit () {
        handleString(input);
        axios
            .get(geoUrl)
            .then(res => {
                lati = res.data[0]["lat"];
                long = res.data[0]["lon"];
                handleClick(lati, long);
            })
            .catch(err => {alert('error')});
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    }
    
    const [showModal, setShowModal] = useState(true);
    const handleOnClose = () => setShowModal(false);

  return (
    <div>
       <div className="text-gray-900 font-sans">
               <div style={{backgroundImage: `url('https://cdn.pixabay.com/photo/2012/08/27/14/19/mountains-55067_1280.png')`,  backgroundRepeat: 'no-repeat'}} className="h-screen min-w-full bg-cover flex flex-col justify-between">
                   <div id="nav-bar" className="m-4">
                       <nav className="flex justify-between">
                           <div className="flex align-middle">
                               <h3 className="font-bold text-4xl text-white">Sunset</h3>
                           </div>
                           <div className="flex align-middle"></div>
                       </nav>
                   </div>
                    <div id="hero" className="flex justify-center -mt-24 text-white">
                        <div id="text" className="text-left">
                            <h2 className="text-md">How's the sunset today?</h2>
                            {!isLoading ? (<h1 className="text-9xl">{score}</h1>) : (<h1 className="text-9xl">...</h1>)}
                            <div className="form-control">
                              <label className="input-group py-4">
                                   <input type="text" placeholder="Enter location" className="input input-bordered bg-opacity-80" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} />
                                   <button class="btn btn-square " onClick={handleSubmit}>
                                       <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                   </button>
                              </label>
                            </div>
                        </div>
                    </div>
                    <div id="bottom">
                        <h2 className="text-gray-50 text-sm p-1">The sun sets at {time} in {location}</h2>
                    </div>
                </div>
        </div>
        <Modal onClose={handleOnClose} visible={showModal}/>
    </div>
  );
}

export default App;
