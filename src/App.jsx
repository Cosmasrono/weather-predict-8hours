// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';

const api = {
  key: "4f8e795dcd6dbf7b9f5276bff095ffc1",
  base: "https://api.openweathermap.org/data/2.5/"
};

function App() {
  const [query, setQuery] = useState('');
  const [forecast, setForecast] = useState([]);

  const search = (evt) => {
    if (evt.key === "Enter") {
      fetch(`${api.base}forecast?q=${query}&appid=${api.key}&units=metric`)
        .then((res) => res.json())
        .then((result) => {
          setForecast(result.list.slice(0, 8)); // Get the forecast for the next 24 hours (8 data points at 3-hour intervals)
          setQuery('');
          console.log(result);
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
    <div className="app">
      <main>
        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Search..."
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            onKeyPress={search}
          />
        </div>
        {forecast.length > 0 && (
          <div className="forecast-box">
            {forecast.map((data) => (
              <div className="forecast-item" key={data.dt}>
                <div className="forecast-date">{dateBuilder(data.dt)}</div>
                <div className="forecast-temp">{Math.round(data.main.temp)}°C</div>
                <div className="forecast-description">{data.weather[0].description}</div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
