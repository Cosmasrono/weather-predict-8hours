// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import './App.css';

const api = {
  key: "4f8e795dcd6dbf7b9f5276bff095ffc1",
  base: "https://api.openweathermap.org/data/2.5/"
};

function App() {
  const [forecast, setForecast] = useState([]);
  const [locationError, setLocationError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  useEffect(() => {
    fetchWeatherByLocation();
  }, []);

  const fetchWeatherByLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        (error) => {
          console.error(error);
          setLocationError(true);
        }
      );
    } else {
      setLocationError(true);
    }
  };

  const fetchWeather = (latitude, longitude) => {
    fetch(`${api.base}forecast?lat=${latitude}&lon=${longitude}&appid=${api.key}&units=metric`)
      .then((res) => res.json())
      .then((result) => {
        setForecast(result.list.slice(0, 8));
        setCity(result.city.name);
        setCountry(result.city.country);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const searchWeather = () => {
    if (searchQuery) {
      fetch(`${api.base}weather?q=${searchQuery}&appid=${api.key}&units=metric`)
        .then((res) => res.json())
        .then((result) => {
          if (result.cod === "404") {
            setForecast([]);
            setCity('');
            setCountry('');
          } else {
            setForecast([result]);
            setCity(result.name);
            setCountry(result.sys.country);
          }
          setSearchQuery('');
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const dateBuilder = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const day = date.toLocaleDateString('en-US', { weekday: 'long' });
    const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

    return `${day} ${time}`;
  };

  return (
    <div className="App bg-blue-300">
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <h1 className=' text-blue-600 text-5xl'>Home</h1>
      <div className="max-w-md mx-auto"><h1 className=' text-2xl text-blue-500 items-center justify-center'>Cossi Weather Application predictor</h1>
        <div className="flex items-center space-x-4">
          <h1 className=' font-bold italic pt-3'>Enhance 8 hrs weather comfortability  </h1>
          <input
            type="text"
            placeholder="Search for a city..."
            className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                searchWeather();
              }
            }}
          />
          <button
            className="bg-indigo-500 text-white rounded-md py-2 px-4 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-400"
            onClick={searchWeather}
          >
            Search
          </button>
        </div>
        <div className="mt-6">
          {locationError ? (
            <div className="text-red-500">Failed to retrieve location. Please enable location access.</div>
          ) : forecast.length > 0 ? (
            <div className="space-y-6">
              <div className="text-2xl font-semibold">{city ? `${city}, ${country}` : 'Fetching default location...'}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {forecast.map((data) => (
                  <div className="bg-gray-100 rounded-lg p-4" key={data.dt}>
                    <div className="text-lg font-semibold">{dateBuilder(data.dt)}</div>
                    <div className="text-gray-600">{Math.round(data.main.temp)}°C</div>
                    <div className="text-gray-600 capitalize">{data.weather[0].description}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <footer className="mt-6 text-center text-gray-600">
        <div>Powered by <a href="https://openweathermap.org/" className="text-blue-500 hover:underline">OpenWeather</a></div>
        <div>Created by <a href="" className="text-blue-500 hover:underline">Cossiwing001@23</a></div>
      </footer>

    </div>
    </div>
  );
}

export default App;
